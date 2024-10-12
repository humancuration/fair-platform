fair-platform/
│
├── .github/
│   └── ci.yaml
│
├── ai-models/
│   ├── eco-consultant/
│   │   ├── agents/
│   │   │   ├── data_cleaning_agent.py
│   │   │   ├── data_ingestion_agent.py
│   │   │   ├── data_processing_agent.py
│   │   │   ├── impact_analysis_agent.py
│   │   │   ├── recommendation_agent.py
│   │   │   └── supply_chain_agent.py
│   │   ├── api/
│   │   │   ├── data_cleaning_api.py
│   │   │   └── data_ingestion_api.py
│   │   ├── dashboard/
│   │   │   ├── templates/
│   │   │   │   └── index.html
│   │   │   ├── app.py
│   │   │   └── routes.py
│   │   ├── models/
│   │   │   ├── lca_model.py
│   │   │   ├── recommendation_model.py
│   │   │   └── supply_chain_model.py
│   │   ├── batch_processor.py
│   │   └── main.py
│   │
│   └── recommendation/
│       ├── app.py
│       └── model.py
│
├── backend/
│   ├── src/
│   │   ├── activitypub/
│   │   │   ├── activitypub.ts
│   │   │   └── index.ts
│   │   ├── ai/
│   │   │   ├── Dockerfile
│   │   │   ├── recommendation_engine.py
│   │   │   └── recommendation_service.py
│   │   ├── api/
│   │   │   └── exportStaticApi.ts
│   │   ├── config/
│   │   │   ├── constants.ts
│   │   │   ├── database.ts
│   │   │   └── keycloak-config.ts
│   │   ├── controllers/
│   │   │   ├── affiliateController.ts
│   │   │   ├── affiliateLinkController.ts
│   │   │   ├── affiliateProgramController.ts
│   │   │   ├── aiEthicsController.ts
│   │   │   ├── analyticsController.ts
│   │   │   ├── authController.ts
│   │   │   ├── campaignController.ts
│   │   │   ├── clickTrackingController.ts
│   │   │   ├── communityWishlistController.ts
│   │   │   ├── contributionController.ts
│   │   │   ├── eventController.ts
│   │   │   ├── gitController.ts
│   │   │   ├── giteaController.ts
│   │   │   ├── githubController.js
│   │   │   ├── groupController.ts
│   │   │   ├── groupMemberController.ts
│   │   │   ├── linkInBioController.ts
│   │   │   ├── marketplaceController.ts
│   │   │   ├── mauticContoller.ts
│   │   │   ├── minsiteContoller.ts
│   │   │   ├── n8ncontroller.ts
│   │   │   ├── payoutcontroller.ts
│   │   │   ├── recommendationController.ts
│   │   │   ├── resourceController.ts
│   │   │   ├── rewardController.ts
│   │   │   ├── rewardsController.ts
│   │   │   ├── SearchController.ts
│   │   │   ├── SurveyController.ts
│   │   │   ├── testimonialController.ts
│   │   │   ├── uploadController.ts
│   │   │   ├── voteController.ts
│   │   │   └── wishlistController.ts
│   │   ├── middleware/
│   │   │   ├── activityLogger.ts
│   │   │   ├── auth.ts
│   │   │   ├── errorHandler.ts
│   │   │   ├── setupMiddleware.ts
│   │   │   └── validate.ts
│   │   ├── models/
│   │   │   ├── AffiliateLink.ts
│   │   │   ├── AffiliateProgram.ts
│   │   │   ├── AnalyticsEvent.ts
│   │   │   ├── Brands.ts
│   │   │   ├── Campaign.ts
│   │   │   ├── ClickTracking.ts
│   │   │   ├── CommunityWishlist.ts
│   │   │   ├── CommunityWishlistItem.ts
│   │   │   ├── Company.ts
│   │   │   ├── Contribution.ts
│   │   │   ├── Dividend.ts
│   │   │   ├── event.model.ts
│   │   │   ├── Event.ts
│   │   │   ├── Forum.ts
│   │   │   ├── Grant.ts
│   │   │   ├── Group.ts
│   │   │   ├── groupMember.model.ts
│   │   │   ├── GroupType.ts
│   │   │   ├── index.ts
│   │   │   ├── LinkPage.ts
│   │   │   ├── LinkedContent.ts
│   │   │   ├── Minsite.ts
│   │   │   ├── Notification.ts
│   │   │   ├── Payout.ts
│   │   │   ├── petition.model.ts
│   │   │   ├── Post.ts
│   │   │   ├── Product.ts
│   │   │   ├── project.model.ts
│   │   │   ├── Reward.ts
│   │   │   ├── Survey.ts
│   │   │   ├── SurveyResponse.ts
│   │   │   ├── Testimonial.ts
│   │   │   ├── User.ts
│   │   │   ├── UserActivity.ts
│   │   │   ├── UserReward.ts
│   │   │   ├── vote.model.ts
│   │   │   ├── Wishlist.ts
│   │   │   └── WishlistItem.ts
│   │   ├── routes/
│   │   │   ├── affiliateRoutes.ts
│   │   │   ├── analyticsRoutes.ts
│   │   │   ├── authRoutes.ts
│   │   │   └── setupRoutes.ts
│   │   ├── socket/
│   │   │   └── setupSocketIO.ts
│   │   ├── graphql/
│   │   │   ├── resolvers.ts
│   │   │   ├── schema.ts
│   │   │   └── setupApolloServer.ts
│   │   ├── utils/
│   │   │   └── logger.ts
│   │   ├── app.ts
│   │   ├── index.ts
│   │   └── server.ts
│   ├── .env
│   ├── .eslintrc.json
│   ├── Dockerfile
│   ├── greenlock.ts
│   ├── jest.config.ts
│   ├── main.py
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/
│   │   │   └── api.ts
│   │   ├── components/
│   │   │   ├── affiliate/
│   │   │   │   ├── AffiliateLink.tsx
│   │   │   │   ├── AffiliateLinkCard.tsx
│   │   │   │   └── CreateAffiliateLinkModal.tsx
│   │   │   ├── common/
│   │   │   │   └── Button.jsx
│   │   │   ├── forms/
│   │   │   ├── Accordion.tsx
│   │   │   ├── AddCommunityWishlistItemModal.tsx
│   │   │   ├── AddWishlistItemModal.tsx
│   │   │   ├── AIDashboard.tsx
│   │   │   ├── AIJobMarketplace.tsx
│   │   │   ├── AnimatedHeading.tsx
│   │   │   ├── AnimatedRoutes.tsx
│   │   │   ├── AvatarGenerator.tsx
│   │   │   ├── BackgroundMusic.tsx
│   │   │   ├── BarChart.tsx
│   │   │   ├── Breadcrumbs.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   ├── Calendar.tsx
│   │   │   ├── CampaignCard.tsx
│   │   │   ├── CampaignDetail.tsx
│   │   │   ├── CampaignList.tsx
│   │   │   ├── CheckoutOrderSummary.tsx
│   │   │   ├── AdminPanel.tsx
│   │   │   ├── AdminSidebar.tsx
│   │   │   └── MusicPlayerControls.tsx
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── providers/
│   │   ├── services/
│   │   ├── store/
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── Dockerfile
│   └── package.json
│
└── README.md