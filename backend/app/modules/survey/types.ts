import { ObjectType, Field, ID, Int, Float, InputType, registerEnumType } from 'type-graphql';
import { User } from '../user/types';
import { 
  SurveyDomain, 
  QuestionType, 
  InsightType,
  CorrelationStrength,
  TrendDirection,
  SurveyStatus,
  LinkedContentType 
} from '@prisma/client';

registerEnumType(SurveyDomain, { name: 'SurveyDomain' });
registerEnumType(QuestionType, { name: 'QuestionType' });
registerEnumType(InsightType, { name: 'InsightType' });
registerEnumType(CorrelationStrength, { name: 'CorrelationStrength' });
registerEnumType(TrendDirection, { name: 'TrendDirection' });
registerEnumType(SurveyStatus, { name: 'SurveyStatus' });
registerEnumType(LinkedContentType, { name: 'LinkedContentType' });

@ObjectType()
export class Survey {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => SurveyDomain)
  domain: SurveyDomain;

  @Field(() => [Question])
  questions: Question[];

  @Field(() => DomainFeatures, { nullable: true })
  features?: DomainFeatures;

  @Field(() => SurveyStatus)
  status: SurveyStatus;

  @Field(() => Int)
  createdById: number;

  @Field(() => User)
  createdBy: User;

  @Field(() => [User])
  collaborators: User[];

  @Field(() => [SurveyResponse])
  responses: SurveyResponse[];

  @Field(() => Analytics, { nullable: true })
  analytics?: Analytics;

  @Field(() => [LinkedContent])
  linkedContent: LinkedContent[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class Question {
  @Field(() => ID)
  id: string;

  @Field(() => QuestionType)
  type: QuestionType;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  required: boolean;

  @Field(() => JSON, { nullable: true })
  config?: any;

  @Field(() => Int)
  order: number;

  @Field(() => JSON, { nullable: true })
  validation?: any;

  @Field(() => JSON, { nullable: true })
  conditions?: any;
}

@ObjectType()
export class SurveyResponse {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  surveyId: string;

  @Field(() => Int)
  respondentId: number;

  @Field(() => JSON)
  answers: any;

  @Field(() => JSON, { nullable: true })
  metadata?: any;

  @Field(() => User)
  respondent: User;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class Analytics {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  surveyId: string;

  @Field(() => JSON)
  results: any;

  @Field(() => [Insight])
  insights: Insight[];

  @Field(() => [Correlation])
  correlations: Correlation[];

  @Field(() => [Trend])
  trends: Trend[];

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class Insight {
  @Field(() => ID)
  id: string;

  @Field(() => InsightType)
  type: InsightType;

  @Field()
  description: string;

  @Field(() => JSON)
  data: any;

  @Field(() => Float)
  confidence: number;
}

@ObjectType()
export class Correlation {
  @Field(() => ID)
  id: string;

  @Field(() => [ID])
  questionPair: string[];

  @Field(() => Float)
  coefficient: number;

  @Field(() => CorrelationStrength)
  strength: CorrelationStrength;

  @Field(() => Float)
  significance: number;
}

@ObjectType()
export class Trend {
  @Field(() => ID)
  id: string;

  @Field()
  metric: string;

  @Field(() => TrendDirection)
  direction: TrendDirection;

  @Field(() => Float)
  magnitude: number;

  @Field()
  period: string;

  @Field(() => JSON)
  data: any;
}

@ObjectType()
export class DomainFeatures {
  @Field({ nullable: true })
  realTimeTracking?: boolean;

  @Field({ nullable: true })
  geoLocation?: boolean;

  @Field({ nullable: true })
  timeSeriesData?: boolean;

  @Field({ nullable: true })
  mediaCapture?: boolean;

  @Field({ nullable: true })
  environmentalMetrics?: boolean;

  @Field({ nullable: true })
  interactiveElements?: boolean;

  @Field({ nullable: true })
  automatedTesting?: boolean;
}

@InputType()
export class CreateSurveyInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => SurveyDomain)
  domain: SurveyDomain;

  @Field(() => [QuestionInput])
  questions: QuestionInput[];

  @Field(() => DomainFeaturesInput, { nullable: true })
  features?: DomainFeaturesInput;
}

@InputType()
export class QuestionInput {
  @Field(() => QuestionType)
  type: QuestionType;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  required: boolean;

  @Field(() => JSON, { nullable: true })
  config?: any;

  @Field(() => Int)
  order: number;

  @Field(() => JSON, { nullable: true })
  validation?: any;

  @Field(() => JSON, { nullable: true })
  conditions?: any;
}

@InputType()
export class DomainFeaturesInput {
  @Field({ nullable: true })
  realTimeTracking?: boolean;

  @Field({ nullable: true })
  geoLocation?: boolean;

  @Field({ nullable: true })
  timeSeriesData?: boolean;

  @Field({ nullable: true })
  mediaCapture?: boolean;

  @Field({ nullable: true })
  environmentalMetrics?: boolean;

  @Field({ nullable: true })
  interactiveElements?: boolean;

  @Field({ nullable: true })
  automatedTesting?: boolean;
}

@InputType()
export class SurveyResponseInput {
  @Field(() => JSON)
  answers: any;

  @Field(() => JSON, { nullable: true })
  metadata?: any;
}
