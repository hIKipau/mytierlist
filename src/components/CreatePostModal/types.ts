export type CreatePostValues = {
  title: string;
  body: string;
};

export type CreatePostModalProps = {
  isOpen: boolean;
  author: string;
  onClose: () => void;
  onSubmit: (values: CreatePostValues) => void;
};
