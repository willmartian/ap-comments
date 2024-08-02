export type Comment = {
  id: string;
  url: string;
  replies_count: number;
  reblogs_count: number;
  favourites_count: number;
  content: string;
  account: Account;
  created_at: string;
  in_reply_to_id: string;
};

export type CommentsResponse = {
  descendants: Comment[];
};

export type Account = {
  id: string;
  username: string;
  display_name: string;
  url: string;
  avatar: string;
  note: string;
};
