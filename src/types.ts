export interface LearnChapter {
  title: string;
  definition: string;
  whyItMatters: string;
  weakExecution: string;
  developingExecution: string;
  matureExecution: string;
  beforeAndAfter: {
    before: string;
    after: string;
    note: string;
  };
  commonMisconceptions: string;
  forYourWriting: string;
}

export interface ReadLikeAWriterItem {
  writer: string;
  title: string;
  recommendation: string;
  craftElement: string;
  guidingQuestions: string[];
}

export interface CloseReadingData {
  text: string;
  craftNote: string;
  revisionComparison: string;
}

export interface WritingLabLevel {
  title: string;
  prompt: string;
  time: string;
}

export interface ModuleData {
  id: number;
  title: string;
  subtitle: string;
  corePrinciple: string;
  arrivalQuestion: string;
  arrivalSource?: string;
  learnChapters: LearnChapter[];
  readLikeAWriter: ReadLikeAWriterItem[];
  closeReadingOriginal: CloseReadingData;
  writingLab: {
    enter: WritingLabLevel;
    descend: WritingLabLevel;
    deepWork: WritingLabLevel;
  };
  longWorkPrompt: string;
  poetryPrompt: string;
  reflectionQuestion: string;
}

export interface ReadingBook {
  title: string;
  author: string;
  category: string;
  focus: string;
}

export type ReviewStatus = 'ALIVE' | 'DEVELOPING' | 'NEEDS ATTENTION';

export interface CraftAreaReview {
  status: ReviewStatus;
  note: string;
}

export type ModuleReviews = Record<string, CraftAreaReview>;
export type AllSelfReviews = Record<number, ModuleReviews>;

export interface NotebooksState {
  working: string;
  shadow: string;
  almostExplained: string;
  taughtMe: string;
}

export type MainView = 'home' | 'module' | 'library' | 'notebooks';

export type ModuleTab =
  | 'arrival'
  | 'learn'
  | 'read'
  | 'closeReading'
  | 'writingLab'
  | 'longWork'
  | 'poetryLab'
  | 'return';

export type NotebookTab = 'working' | 'shadow' | 'almostExplained' | 'taughtMe';
