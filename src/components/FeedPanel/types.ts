export type FeedItemType = "post" | "tierlist" | "media";

export type FeedItem = {
  id: string;
  type: FeedItemType;
  title: string;
  author: string;
  summary: string;
};

export type FeedPanelProps = {
  items: FeedItem[];
  authUser: string | null;
  onNewPost: (post: FeedItem) => void;
};
