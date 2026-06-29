export interface Comment {
  id: string;
  slug: string;
  author: string;
  authorImage?: string;
  content: string;
  createdAt: string;
  approved: boolean;
}
