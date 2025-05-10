export type CampaignContent =
  | { type: "paragraph"; value: string }
  | { type: "separator" }
  | { type: "quote"; title: string; theme: string; description: string }
  | { type: "title"; tag: string; value: string }
  | { type: "image"; src: string }
  | { type: "button"; value: string; href: string }
  | {
      type: "pricing";
      name: string;
      price: string;
      before_price: string;
      interval: string;
      features: string[];
      button: {
        label: string;
        href: string;
      };
    };

export interface Campaign {
  type: "campaign";
  id: string;
  lang: string;
  sender: string;
  subject: string;
  preview: string;
  content: CampaignContent[];
}
