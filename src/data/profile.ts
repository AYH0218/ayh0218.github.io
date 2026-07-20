// サイトの全コンテンツをこのファイルに集約する。
// 文言・実績の更新はこのファイルの編集だけで完結する。
// NOTE: 現在は仮データ。実データに差し替えるまで公開しないこと。

export interface AppWork {
  name: string;
  tagline: string;
  description: string;
  tech: string[];
  appStoreUrl?: string;
  /** LPやWeb版など、ストア外のリンク */
  web?: { label: string; url: string };
  /** /public 配下のアイコン画像パス。未設定ならイニシャル入りのグラデーションを表示 */
  icon?: string;
  /** アイコン未設定時のフォールバックに使うグラデーション(CSS値) */
  accent: string;
}

export interface SkillCategory {
  title: string;
  items: string[];
}

export interface CareerItem {
  period: string;
  role: string;
  org?: string;
  description: string;
}

export interface SocialLink {
  label: string;
  url: string;
  note?: string;
}

export const profile = {
  name: "Ayuha",
  alias: "AYH0218",
  title: "iOS & Web Engineer",
  catchphrase: "アイデアを、手ざわりのあるプロダクトに。",
  lead: "Webアプリ・業務システムからiOSアプリまで、要件整理から実装・リリース・運用までを一貫して手がけるエンジニアです。個人開発では企画からApp Store公開までを一人で担い、5本のiOSアプリをリリースしています。",
  location: "Japan",
  contactFormUrl: "https://forms.gle/quW3SwSGB1Ezv3cR7",
} as const;

/** Aboutセクションの段落 */
export const about: string[] = [
  "ネットワークエンジニアとしてキャリアを始め、ECサイトの運用・Web制作を経てフロントエンド開発へ。現在はWebアプリケーション・業務システム・iOSアプリの開発と保守運用に携わっています。",
  "フロントエンドを軸に、バックエンド・AWS・iOSまで必要な技術を自走でキャッチアップできることが強みです。業務と並行して個人開発にも取り組み、企画からデザイン、実装、Web制作、App Store公開までをすべて一人で担ったiOSアプリを5本リリースしました。Claude CodeやCodex CLIなどのAIツールも開発フローに取り入れ、調査・実装・ドキュメント整備を効率化しています。",
];

export const apps: AppWork[] = [
  {
    name: "膳-ZEN-",
    tagline: "かんたん食事記録",
    description:
      "毎日の食事を簡単に記録し、振り返りやCSV書き出しでAI・専門家による分析に活用できる食事記録アプリ。SwiftDataとCloudKitによるiCloud同期、写真表示、お気に入り、テンプレート、繰り返し登録などを実装し、App Storeへの公開・アップデートまで担当。コンセプトを伝えるLPも自作。",
    tech: ["Swift", "SwiftData", "CloudKit"],
    appStoreUrl: "https://apps.apple.com/jp/app/id6788764201",
    web: { label: "LP", url: "https://zen-lp.pages.dev/" },
    icon: "/apps/zen.jpg",
    accent: "linear-gradient(135deg, #94e2d5, #a6e3a1)",
  },
  {
    name: "HRV Tracker Minimal",
    tagline: "Apple WatchでHRVをシンプルに",
    description:
      "Apple Watchで計測した心拍変動(HRV)をシンプルに確認できるアプリ。余計な機能を省いたミニマルなUIと円形コンプリケーションを実装。公開初日にヘルスケアカテゴリでランキング入りを達成。",
    tech: ["Swift", "watchOS", "HealthKit"],
    appStoreUrl: "https://apps.apple.com/jp/app/id6787385416",
    icon: "/apps/hrv.jpg",
    accent: "linear-gradient(135deg, #f38ba8, #fab387)",
  },
  {
    name: "Voidspace",
    tagline: "呼吸法・瞑想サポート",
    description:
      "4-7-8呼吸法、通常呼吸、ボックス呼吸に対応した呼吸法・瞑想サポートアプリ。Web版とiOSアプリを展開し、VercelへのデプロイからApp Store公開までを短期間で実施。",
    tech: ["iOS", "Web", "Vercel"],
    appStoreUrl: "https://apps.apple.com/jp/app/id6787887612",
    web: { label: "Web版", url: "https://voidspacex.vercel.app/" },
    icon: "/apps/voidspace.jpg",
    accent: "linear-gradient(135deg, #89b4fa, #b4befe)",
  },
  {
    name: "WordStock",
    tagline: "自分専用の語彙ノート",
    description:
      "日常や学習で出会った英単語・フレーズを、意味・文脈・タグ・遭遇回数とともに管理できる語彙ノートアプリ。検索、バックアップ、CSVエクスポート、音声読み上げ、多言語UIなどを実装。CapacitorでiOSアプリ化し、買い切り・サブスクリプションによるPro機能も導入。",
    tech: ["Capacitor", "Web", "In-App Purchase"],
    appStoreUrl: "https://apps.apple.com/jp/app/id6779509128",
    icon: "/apps/wordstock.jpg",
    accent: "linear-gradient(135deg, #f9e2af, #fab387)",
  },
  {
    name: "DailyQuest",
    tagline: "現実世界のデイリークエスト",
    description:
      "日常生活の中で実行できる「サイドミッション」を提案し、達成したクエストを実績として積み上げていくアプリ。ゲームのタスクシステムに着想を得た体験設計で、企画から実装、App Store公開まで担当。",
    tech: ["iOS", "個人開発"],
    appStoreUrl: "https://apps.apple.com/jp/app/id6791475486",
    icon: "/apps/dailyquest.jpg",
    accent: "linear-gradient(135deg, #cba6f7, #f5c2e7)",
  },
];

export const skills: SkillCategory[] = [
  {
    title: "iOS / モバイル",
    items: [
      "Swift",
      "SwiftUI",
      "SwiftData",
      "CloudKit",
      "HealthKit",
      "watchOS",
      "Capacitor",
      "App Store 申請",
    ],
  },
  {
    title: "フロントエンド",
    items: [
      "TypeScript",
      "JavaScript",
      "React",
      "Next.js",
      "Astro",
      "Tailwind CSS",
      "Sass",
      "WordPress",
    ],
  },
  {
    title: "バックエンド / インフラ",
    items: ["PHP / Laravel", "Python / Django", "MySQL", "AWS", "Docker", "Linux"],
  },
  {
    title: "ツール / AI活用",
    items: [
      "Git / GitHub",
      "Neovim",
      "Claude Code",
      "Codex CLI",
      "LLM活用",
      "Figma",
      "Photoshop / Illustrator",
    ],
  },
];

export const career: CareerItem[] = [
  {
    period: "2023 — 現在",
    role: "Webアプリ / iOSアプリエンジニア",
    org: "SES企業",
    description:
      "大手SaaS企業の自社サイトにてReact / Next.js / Astro / TypeScriptによるフロントエンド開発を担当した後、官公庁・研究機関・民間企業向けのWebアプリ・業務システム・iOSアプリの開発と保守運用に従事。Laravel / AWS / Docker / Swiftなど案件ごとに必要な技術を自走でキャッチアップし、要件整理からリリース・運用まで一貫して対応。",
  },
  {
    period: "2017 — 2023",
    role: "フロントエンドエンジニア / Web運用",
    org: "エンタメ系EC",
    description:
      "大手ECサイトにてLP・特設ページ制作、新機能実装、UI/UX改善、アクセス解析、広告運用、サイト内検索エンジンのチューニング、RPA導入などWeb制作・運用全般を担当。在籍中に海外語学留学を経験し、英語での問い合わせ対応も担った。",
  },
  {
    period: "2015 — 2017",
    role: "EC運営 / Web制作",
    description:
      "小規模ECの立ち上げ・運営を経てWeb制作へ。HTML / CSS / JavaScriptによるコーディング、Photoshopでのデザイン制作、医療系メディアの品質管理やWordPressサイトの改修などを担当。",
  },
  {
    period: "2005 — 2015",
    role: "キャリア初期",
    description:
      "LPICを取得しネットワークエンジニアとしてキャリアをスタート。その後は大手Webサービスのカスタマーサポート・出品審査に長く携わり、ガイドライン整備や新人教育を通じてユーザー視点とサービス運営の基礎を培った。",
  },
];

export const links: SocialLink[] = [
  { label: "GitHub", url: "https://github.com/AYH0218" },
];
