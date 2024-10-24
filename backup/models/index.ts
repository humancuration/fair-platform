// backend/src/models/index.ts
import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';

// Import all models
import { Achievement } from './Achievement';
import { Event } from './Event';
import { EventAttendee } from './EventAttendee';
import { Grant } from './Grant';
import { Inventory } from './Inventory';
import { Item } from './Item';
import { LinkedContent } from './LinkedContent';
import { LinkPage } from './LinkPage';
import { Notification } from './Notification';
import { Petition } from './petition.model';
import { Project } from './project.model';
import { Resource } from './resource.model';
import { Testimonial } from './Testimonial';
import { UserAchievement } from './UserAchievement';
import { Vote } from './vote.model';

// Import existing models from other modules
import { User } from '../modules/user/User';
import { Campaign } from '../modules/campaign/Campaign';
import { AffiliateLink } from './AffiliateLink';
import { AnalyticsEvent } from '../modules/analytics/AnalyticsEvent';
import { AffiliateProgram } from './AffiliateProgram';
import { Brand } from '../modules/dashboard/affiliate/Brands';
import { ClickTracking } from '../modules/dashboard/affiliate/ClickTracking';
import { CommunityWishlist } from '../modules/wishlist/CommunityWishlist';
import { CommunityWishlistItem } from '../modules/wishlist/CommunityWishlistItem';
import { Company } from '../modules/marketplace/Company';
import { Contribution } from '../modules/campaign/Contribution';
import { Dividend } from '../modules/dashboard/affiliate/Dividend';
import { Forum } from '../modules/forum/Forum';
import { Group } from '../modules/group/Group';
import { GroupMember } from './GroupMember';
import { GroupType } from '../modules/group/GroupType';
import { Minsite } from './Minsite';
import { Payout } from '../modules/dashboard/affiliate/Payout';
import { Post } from '../modules/forum/Post';
import { Product } from '../modules/marketplace/Product';
import { Reward } from '../modules/campaign/Reward';
import { Survey } from './Survey';
import { SurveyResponse } from './SurveyResponse';
import { UserActivity } from './UserActivity';
import { UserReward } from './UserReward';
import { Wishlist } from './Wishlist';
import { WishlistItem } from '../modules/wishlist/WishlistItem';

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: 'postgres',
  models: [
    Achievement,
    Event,
    EventAttendee,
    Grant,
    Inventory,
    Item,
    LinkedContent,
    LinkPage,
    Notification,
    Petition,
    Project,
    Resource,
    Testimonial,
    UserAchievement,
    Vote,
    // Existing models
    User,
    Campaign,
    AffiliateLink,
    AnalyticsEvent,
    AffiliateProgram,
    Brand,
    ClickTracking,
    CommunityWishlist,
    CommunityWishlistItem,
    Company,
    Contribution,
    Dividend,
    Forum,
    Group,
    GroupMember,
    GroupType,
    Minsite,
    Payout,
    Post,
    Product,
    Reward,
    Survey,
    SurveyResponse,
    UserActivity,
    UserReward,
    Wishlist,
    WishlistItem,
  ],
});

export {
  sequelize,
  // Export all models
  Achievement,
  Event,
  EventAttendee,
  Grant,
  Inventory,
  Item,
  LinkedContent,
  LinkPage,
  Notification,
  Petition,
  Project,
  Resource,
  Testimonial,
  UserAchievement,
  Vote,
  // Export existing models
  User,
  Campaign,
  AffiliateLink,
  AnalyticsEvent,
  AffiliateProgram,
  Brand,
  ClickTracking,
  CommunityWishlist,
  CommunityWishlistItem,
  Company,
  Contribution,
  Dividend,
  Forum,
  Group,
  GroupMember,
  GroupType,
  Minsite,
  Payout,
  Post,
  Product,
  Reward,
  Survey,
  SurveyResponse,
  UserActivity,
  UserReward,
  Wishlist,
  WishlistItem,
};
