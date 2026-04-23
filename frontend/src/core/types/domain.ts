export type ID = string;

export type Tag = {
  id: ID;
  name: string;
};

export type Group = {
  id: ID;
  name: string;
};

export type Comment = {
  id: ID;
  content: string;
  createdAt: string;
  updatedAt?: string;
};

export type ImageItem = {
  id: ID;
  title: string;
  imageUrl: string;
  groupIds: ID[];
  tagIds: ID[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
};

export type PaletteColor = {
  id: ID;
  hex: string;
};

export type PaletteItem = {
  id: ID;
  title: string;
  colors: PaletteColor[];
  groupIds: ID[];
  tagIds: ID[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
};

export type Filters = {
  query: string;
  groupId?: ID;
  tagId?: ID;
};

export type VisualItem = ImageItem | PaletteItem;

export type PersistedAppState = {
  images: ImageItem[];
  palettes: PaletteItem[];
  groups: Group[];
  tags: Tag[];
};
