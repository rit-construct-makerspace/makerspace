export enum AnnouncementItemType {
    Text = "TEXT"
  }
  
//   export interface Option {
//     id: string;
//     text: string;
//     correct: boolean;
//   }
  
  export interface Announcement {
    id: number;
    title: string;
    description: string;
  };
  
  export interface Post {
    id: number;
    postDate: string;
    expDate: string;
  }
  