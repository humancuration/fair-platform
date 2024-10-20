// backend/src/models/index.ts
import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';

// Import all models
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
import { Event } from './Event';
import { Forum } from '../modules/forum/Forum';
import { Grant } from './Grant';
import { GroupMember } from './GroupMember';
import { GroupType } from '../modules/group/GroupType';
import { LinkedContent } from './LinkedContent';
import { LinkPage } from './LinkPage';
import { Minsite } from './Minsite';
import { Notification } from './Notification';
import { Payout } from '../modules/dashboard/affiliate/Payout';
import { Petition } from './petition.model';
import { Post } from '../modules/forum/Post';
import { Product } from '../modules/marketplace/Product';
import { Project } from './project.model';
import { Resource } from './resource.model';
import { Reward } from '../modules/campaign/Reward';
import { Survey } from './Survey';
import { SurveyResponse } from './SurveyResponse';
import { Testimonial } from './Testimonial';
import { UserActivity } from './UserActivity';
import { UserReward } from './UserReward';
import { Vote } from './vote.model';
import { Wishlist } from './Wishlist';
import { WishlistItem } from '../modules/wishlist/WishlistItem';
// Import other models...

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: 'postgres',
  models: [
    User, Campaign, AffiliateLink, AnalyticsEvent, AffiliateProgram, Brand, 
    ClickTracking, CommunityWishlist, CommunityWishlistItem, Company, 
    Contribution, Dividend, Event, Forum, Grant, GroupMember, GroupType, 
    LinkedContent, LinkPage, Minsite, Notification, Payout, Petition, Post, 
    Product, Project, Resource, Reward, Survey, SurveyResponse, Testimonial, 
    UserActivity, UserReward, Vote, Wishlist, WishlistItem
  ],
});

export { sequelize };

// Export all models
export {
  User, Campaign, AffiliateLink, AnalyticsEvent, AffiliateProgram, Brand, 
  ClickTracking, CommunityWishlist, CommunityWishlistItem, Company, 
  Contribution, Dividend, Event, Forum, Grant, GroupMember, GroupType, 
  LinkedContent, LinkPage, Minsite, Notification, Payout, Petition, Post, 
  Product, Project, Resource, Reward, Survey, SurveyResponse, Testimonial, 
  UserActivity, UserReward, Vote, Wishlist, WishlistItem
};
// Export other models...
