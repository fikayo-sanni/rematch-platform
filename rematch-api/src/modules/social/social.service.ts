import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DuctapeService } from '../../config/ductape.config';
import { GraphSetupService } from '../../database/graph-setup.service';
import { Crew, NoisePost, Notification, Activity } from '../../common/interfaces';
import {
  CreateCrewDto,
  CrewResponseDto,
  CreateNoisePostDto,
  NoisePostResponseDto,
  CreateReplyDto,
  ReplyResponseDto,
} from './dto/social.dto';


import { UserResponseDto } from '../users/dto/user.dto';

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SocialService {
  constructor(
    private readonly ductape: DuctapeService,
    private readonly graphService: GraphSetupService,
  ) {}

  // ==================== CREWS ====================

  async createCrew(createCrewDto: CreateCrewDto): Promise<Crew> {
    const crewData = {
      id: uuidv4(),
      name: createCrewDto.name,
      tag: createCrewDto.tag,
      logo: createCrewDto.logo,
      description: createCrewDto.description,
      leaderId: createCrewDto.leaderId,
      memberIds: [createCrewDto.leaderId],
      memberCount: 1,
      wins: 0,
      losses: 0,
      rank: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.ductape.dbInsert('crews', crewData);

    // Add leader as member
    await this.ductape.dbInsert('crew_members', {
      id: uuidv4(),
      crewId: crewData.id,
      userId: createCrewDto.leaderId,
      role: 'leader',
      joinedAt: new Date(),
    });

    // Create graph relationships
    await this.graphService.createCrewNode(crewData.id, crewData.name, crewData.tag);
    await this.graphService.userJoinsCrew(createCrewDto.leaderId, crewData.id, 'leader');

    // Return as Crew with empty members array (will be populated on fetch)
    return { ...crewData, members: [] } as Crew;
  }

  async getCrew(crewId: string): Promise<Crew> {
    const crew = await this.ductape.dbFindOne('crews', { id: crewId });
    if (!crew) {
      throw new NotFoundException('Crew not found');
    }
    return crew as Crew;
  }

  async getCrews(limit = 20, offset = 0): Promise<Crew[]> {
    const crews = await this.ductape.dbFindMany('crews', {}, {
      limit,
      skip: offset,
      sort: { rank: 1 }
    });
    return crews as Crew[];
  }

  async joinCrew(crewId: string, userId: string): Promise<void> {
    const crew = await this.getCrew(crewId);

    // Check if already a member
    const existingMember = await this.ductape.dbFindOne('crew_members', {
      crewId,
      userId,
    });
    if (existingMember) {
      throw new BadRequestException('User is already a member of this crew');
    }

    // Add to crew_members
    await this.ductape.dbInsert('crew_members', {
      id: uuidv4(),
      crewId,
      userId,
      role: 'member',
      joinedAt: new Date(),
    });

    // Update crew
    await this.ductape.dbUpdate('crews', { id: crewId }, {
      $push: { members: userId },
      $inc: { memberCount: 1 },
      $set: { updatedAt: new Date() },
    });

    // Update graph
    await this.graphService.userJoinsCrew(userId, crewId, 'member');

    // Create activity
    await this.createActivity(userId, 'crew_joined', `Joined crew ${crew.name}`);
  }

  async leaveCrew(crewId: string, userId: string): Promise<void> {
    const crew = await this.getCrew(crewId);

    if (crew.leaderId === userId) {
      throw new BadRequestException('Leader cannot leave the crew. Transfer leadership first.');
    }

    await this.ductape.dbDelete('crew_members', { crewId, userId });

    await this.ductape.dbUpdate('crews', { id: crewId }, {
      $pull: { members: userId },
      $inc: { memberCount: -1 },
      $set: { updatedAt: new Date() },
    });
  }

  async getCrewMembers(crewId: string): Promise<any[]> {
    const members = await this.ductape.dbFindMany('crew_members', { crewId });

    // Enrich with user data
    const enrichedMembers = await Promise.all(
      members.map(async (member: any) => {
        const user = await this.ductape.dbFindOne('users', { id: member.userId });
        return {
          ...member,
          user,
        };
      }),
    );

    return enrichedMembers;
  }

  async getCrewLeaderboard(limit = 50): Promise<Crew[]> {
    const crews = await this.ductape.dbFindMany('crews', {}, {
      sort: { wins: -1, losses: 1 },
      limit,
    });
    return crews as Crew[];
  }

  // ==================== NOISE (Feed) ====================

  async createNoisePost(createPostDto: CreateNoisePostDto): Promise<NoisePost> {
    const author = await this.ductape.dbFindOne('users', { id: createPostDto.authorId });
    if (!author) {
      throw new NotFoundException('Author not found');
    }

    // Store with authorId in database
    const postData = {
      id: uuidv4(),
      authorId: createPostDto.authorId,
      content: createPostDto.content,
      image: createPostDto.image,
      clipUrl: createPostDto.clipUrl,
      guildId: createPostDto.guildId,
      likes: 0,
      replies: 0,
      mentions: createPostDto.mentions || [],
      createdAt: new Date(),
    };

    await this.ductape.dbInsert('noise_posts', postData);

    // Return with author object for NoisePost interface
    const post: NoisePost = {
      ...postData,
      author: author as any,
      isLiked: false,
    };

    // Notify mentioned users
    if (post.mentions && post.mentions.length > 0) {
      for (const mentionedUsername of post.mentions) {
        const mentionedUser = await this.ductape.dbFindOne('users', { username: mentionedUsername });
        if (mentionedUser) {
          await this.createNotification(
            (mentionedUser as any).id,
            'feed_mention',
            'You were mentioned!',
            `${(author as any).username} mentioned you in a post`,
            { postId: post.id },
          );
        }
      }
    }


    return post;
  }

  async getNoisePost(postId: string): Promise<NoisePost & { author: any }> {
    const post = await this.ductape.dbFindOne('noise_posts', { id: postId });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const author = await this.ductape.dbFindOne('users', { id: (post as any).authorId });

    return {
      ...(post as NoisePost),
      author: author as any,
    };
  }


  async getNoiseFeed(userId?: string, limit = 20, offset = 0): Promise<any[]> {
    const posts = await this.ductape.dbFindMany('noise_posts', {}, {
      sort: { createdAt: -1 },
      limit,
      skip: offset,
    });

    // Enrich with author data and like status
    const enrichedPosts = await Promise.all(
      posts.map(async (post: any) => {
        const author = await this.ductape.dbFindOne('users', { id: post.authorId });
        let isLiked = false;

        if (userId) {
          const like = await this.ductape.dbFindOne('noise_likes', {
            postId: post.id,
            userId,
          });
          isLiked = !!like;
        }

        return {
          ...post,
          author,
          isLiked,
        };
      }),
    );

    return enrichedPosts;
  }

  async getGuildNoiseFeed(guildId: string, limit = 20): Promise<any[]> {
    const posts = await this.ductape.dbFindMany('noise_posts', { guildId }, {
      sort: { createdAt: -1 },
      limit,
    });

    const enrichedPosts = await Promise.all(
      posts.map(async (post: any) => {
        const author = await this.ductape.dbFindOne('users', { id: post.authorId });
        return {
          ...post,
          author,
        };
      }),
    );

    return enrichedPosts;
  }


  async likePost(postId: string, userId: string): Promise<void> {
    const post = await this.ductape.dbFindOne('noise_posts', { id: postId });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = await this.ductape.dbFindOne('noise_likes', {
      postId,
      userId,
    });

    if (existingLike) {
      // Unlike
      await this.ductape.dbDelete('noise_likes', { postId, userId });
      await this.ductape.dbUpdate('noise_posts', { id: postId }, {
        $inc: { likes: -1 },
      });
    } else {
      // Like
      await this.ductape.dbInsert('noise_likes', {
        id: uuidv4(),
        postId,
        userId,
        createdAt: new Date(),
      });
      await this.ductape.dbUpdate('noise_posts', { id: postId }, {
        $inc: { likes: 1 },
      });
    }
  }

  async deleteNoisePost(postId: string, userId: string): Promise<void> {
    const post = (await this.ductape.dbFindOne('noise_posts', { id: postId })) as any;
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId) {
      throw new BadRequestException('You can only delete your own posts');
    }

    await this.ductape.dbDelete('noise_posts', { id: postId });
    // Also delete likes and replies (optional but good for cleanup)
    await this.ductape.dbDelete('noise_likes', { postId });
    await this.ductape.dbDelete('noise_replies', { postId });
  }

  async createReply(postId: string, createReplyDto: CreateReplyDto): Promise<any> {
    const post = await this.ductape.dbFindOne('noise_posts', { id: postId });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const author = await this.ductape.dbFindOne('users', { id: createReplyDto.authorId });
    if (!author) {
      throw new NotFoundException('Author not found');
    }

    const reply = {
      id: uuidv4(),
      postId,
      authorId: createReplyDto.authorId,
      content: createReplyDto.content,
      likes: 0,
      createdAt: new Date(),
    };

    await this.ductape.dbInsert('noise_replies', reply);

    // Increment reply count
    await this.ductape.dbUpdate('noise_posts', { id: postId }, {
      $inc: { replies: 1 },
    });

    return {
      ...reply,
      author,
      isLiked: false,
    };
  }

  async getPostReplies(postId: string, userId?: string): Promise<any[]> {
    const replies = await this.ductape.dbFindMany('noise_replies', { postId }, {
      sort: { createdAt: 1 },
    });

    const enrichedReplies = await Promise.all(
      replies.map(async (reply: any) => {
        const author = await this.ductape.dbFindOne('users', { id: reply.authorId });
        let isLiked = false;

        if (userId) {
          const like = await this.ductape.dbFindOne('reply_likes', {
            replyId: reply.id,
            userId,
          });
          isLiked = !!like;
        }

        return {
          ...reply,
          author,
          isLiked,
        };
      }),
    );

    return enrichedReplies;
  }

  async likeReply(replyId: string, userId: string): Promise<void> {
    const reply = await this.ductape.dbFindOne('noise_replies', { id: replyId });
    if (!reply) {
      throw new NotFoundException('Reply not found');
    }

    const existingLike = await this.ductape.dbFindOne('reply_likes', {
      replyId,
      userId,
    });

    if (existingLike) {
      await this.ductape.dbDelete('reply_likes', { replyId, userId });
      await this.ductape.dbUpdate('noise_replies', { id: replyId }, {
        $inc: { likes: -1 },
      });
    } else {
      await this.ductape.dbInsert('reply_likes', {
        id: uuidv4(),
        replyId,
        userId,
        createdAt: new Date(),
      });
      await this.ductape.dbUpdate('noise_replies', { id: replyId }, {
        $inc: { likes: 1 },
      });
    }
  }


  // ==================== NOTIFICATIONS ====================

  async createNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    data?: Record<string, any>,
  ): Promise<Notification> {
    const notification: Notification = {
      id: uuidv4(),
      userId,
      type: type as any,
      title,
      message,
      isRead: false,
      data,
      createdAt: new Date(),
    };

    await this.ductape.dbInsert('notifications', notification as any);

    // Send push notification via Ductape
    try {
      await this.ductape.sendNotification('notification_created', {
        userId,
        type,
        title,
        message,
        data,
      } as any);
    } catch (error) {

      console.error('Failed to send push notification:', error);
    }

    return notification;
  }

  async getUserNotifications(userId: string, limit = 50, unreadOnly = false): Promise<Notification[]> {
    const filter: any = { userId };
    if (unreadOnly) {
      filter.isRead = false;
    }

    const notifications = await this.ductape.dbFindMany('notifications', filter, {
      sort: { createdAt: -1 },
      limit,
    });

    return notifications as Notification[];
  }

  async markNotificationRead(notificationId: string): Promise<void> {
    await this.ductape.dbUpdate('notifications', { id: notificationId }, {
      $set: { isRead: true },
    });
  }

  async markAllNotificationsRead(userId: string): Promise<void> {
    await this.ductape.dbUpdate('notifications', { userId, isRead: false }, {
      $set: { isRead: true },
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    const notifications = await this.ductape.dbFindMany('notifications', {
      userId,
      isRead: false,
    });
    return notifications.length;
  }

  // ==================== ACTIVITY ====================

  async createActivity(
    userId: string,
    type: string,
    description: string,
    data?: Record<string, any>,
  ): Promise<Activity> {
    const user = await this.ductape.dbFindOne('users', { id: userId });

    const activityData = {
      id: uuidv4(),
      userId,
      type: type as any,
      description,
      data,
      createdAt: new Date(),
    };

    await this.ductape.dbInsert('activities', activityData);

    const activity: Activity = {
      ...activityData,
      user: user || { id: userId, username: 'Unknown' } as any,
    };

    return activity;
  }

  async getUserActivity(userId: string, limit = 20): Promise<any[]> {
    const activities = await this.ductape.dbFindMany('activities', { userId }, {
      sort: { createdAt: -1 },
      limit,
    });

    const user = await this.ductape.dbFindOne('users', { id: userId });

    return activities.map((activity: any) => ({
      ...activity,
      user,
    }));
  }

  async getFriendsActivity(userId: string, limit = 50): Promise<any[]> {
    // Get user's friends/following from graph
    const traverseResult = (await this.ductape.graphTraverse({
      startNodeId: userId,
      direction: 'outgoing',
      relationshipTypes: ['FOLLOWS'],
      maxDepth: 1,
    })) as any;

    const followedIds =
      traverseResult?.nodes
        ?.filter((n: any) => n.labels?.includes('User'))
        ?.map((n: any) => n.properties?.id || n.id) || [];

    if (followedIds.length === 0) {
      return [];
    }

    // Ductape SDK might not support $in in dbFindMany easily if it's strictly key-value
    // But we can try it or fetch and filter if small. 
    // Given we want to be safe with the SDK:
    const activities = await this.ductape.dbFindMany(
      'activities',
      { userId: { $in: followedIds } },
      {
        sort: { createdAt: -1 },
        limit,
      },
    );

    const enrichedActivities = await Promise.all(
      activities.map(async (activity: any) => {
        const user = await this.ductape.dbFindOne('users', { id: activity.userId });
        return {
          ...activity,
          user,
        };
      }),
    );

    return enrichedActivities;
  }

  // ==================== STORAGE ====================

  async getCrewLogoUploadUrl(crewId: string, fileName: string) {
    const objectKey = `crews/${crewId}-${Date.now()}-${fileName}`;
    const uploadUrl = await this.ductape.getSignedUrl(objectKey, 3600, 'write');
    const publicUrl = `https://storage.ductape.app/${this.ductape.productTag}/${objectKey}`;

    return { uploadUrl, publicUrl };
  }

  async updateCrewLogo(crewId: string, url: string) {
    await this.ductape.dbUpdate(
      'crews',
      { id: crewId },
      { $set: { logo: url } },
    );
    return { success: true };
  }

  async getGraphSuggestions(userId: string): Promise<any[]> {
    // Recommendation: Users in same guild that I don't follow
    // (User)-[:GUILD_MEMBER]->(Guild)<-[:GUILD_MEMBER]-(Suggested)
    // WHERE NOT (User)-[:FOLLOWS]->(Suggested)
    
    // Using a simpler approach: get guilds, then find members
    const traverseResult = (await this.ductape.graphTraverse({
      startNodeId: userId,
      direction: 'both',
      relationshipTypes: ['GUILD_MEMBER'],
      maxDepth: 2,
    })) as any;

    const suggestedIds =
      traverseResult?.nodes
        ?.filter((n: any) => n.labels?.includes('User') && (n.properties?.id || n.id) !== userId)
        ?.map((n: any) => n.properties?.id || n.id) || [];

    // Filter by those not followed
    const followsResult = (await this.ductape.graphTraverse({
      startNodeId: userId,
      direction: 'outgoing',
      relationshipTypes: ['FOLLOWS'],
      maxDepth: 1,
    })) as any;

    const alreadyFollowedIds =
      followsResult?.nodes
        ?.filter((n: any) => n.labels?.includes('User'))
        ?.map((n: any) => n.properties?.id || n.id) || [];

    const finalSuggestions = suggestedIds.filter((id: string) => !alreadyFollowedIds.includes(id));

    // Get unique users
    const uniqueIds = Array.from(new Set(finalSuggestions)).slice(0, 10);

    return Promise.all(
      uniqueIds.map(async (id: string) => {
        const user = await this.ductape.dbFindOne('users', { id });
        if (!user) return null;
        const { password: _, ...userWithoutPassword } = user as any;
        return userWithoutPassword;
      }),
    ).then(results => results.filter(Boolean));
  }
}


