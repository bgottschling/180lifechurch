// Fallback content for all subpages, sourced from existing 180lifechurch.org
// Used when WordPress is unreachable, during local dev, or at build time.

import type {
  MinistryPageData,
  ContentPageData,
  SermonSeriesData,
  LeadershipData,
} from "./subpage-types";
import { BROKEN_IMAGE_PLACEHOLDER } from "./image-utils";

// Visible-fallback image used by every hardcoded ministry card
// thumbnail below. See BROKEN_IMAGE_PLACEHOLDER in image-utils.ts
// for the rationale - short version: when an editor sees the church
// logo on a tile, they know the fallback chain is rendering instead
// of the real WP data and can act on it immediately.
const FALLBACK_CARD_IMAGE = BROKEN_IMAGE_PLACEHOLDER;

// ---------------------------------------------------------------------------
// Ministry Pages
// ---------------------------------------------------------------------------

export const MINISTRY_PAGES: Record<string, MinistryPageData> = {
  "life-groups": {
    title: "180 Life Groups",
    subtitle:
      "Life Groups are a great way to get to know others at the church on a more personal level.",
    slug: "life-groups",
    showOnHomepage: true,
    homepageSortOrder: 10,
    card: {
      image: FALLBACK_CARD_IMAGE,
      tag: "Weekly",
      description:
        "Life is better together. Our small groups meet throughout the week for real conversation, prayer, and growing deeper in faith.",
    },
    accentColor: "#D4A054",
    heroIcon: "Users",
    heroPattern: "network",
    verse: {
      text: "Two are better than one... if either of them falls down, one can help the other up.",
      reference: "Ecclesiastes 4:9-10",
    },
    description: "<p>With many people attending on a Sunday morning, it can sometimes be hard to get to know people. 180 Life Groups are a great way to meet others at the church on a more intimate level. This is a place you grow as a disciple of Christ as you study God's Word and fellowship with others.</p><p>Groups typically have around 8 to 15 people and follow along from the Sunday message. Some meet in person, others online, and some are hybrid.</p><p>We offer groups for families, women, men, young adults, and moms of young children.</p>",
    featureCards: {
      label: "How Groups Work",
      heading: "Life is Better Together",
      cards: [
        {
          icon: "BookOpen",
          label: "Study Together",
          description:
            "Groups follow the Sunday message - diving deeper into the Word together throughout the week.",
        },
        {
          icon: "Coffee",
          label: "Real Relationships",
          description:
            "Small enough for genuine connection, large enough to feel like family - 8 to 15 people per group.",
        },
        {
          icon: "MapPin",
          label: "Meet Anywhere",
          description:
            "In-person, online, or hybrid - find a group that fits your week and your stage of life.",
        },
      ],
    },
    processSteps: {
      label: "Your Onboarding",
      heading: "Getting Into a Group",
      steps: [
        { icon: "Compass", label: "Browse", description: "See what groups are meeting and where" },
        { icon: "MessageCircle", label: "Reach Out", description: "Connect with the group leader for details" },
        { icon: "Coffee", label: "Try One", description: "Visit a meeting - no commitment, just show up" },
        { icon: "Heart", label: "Belong", description: "Find your spot and grow in faith together" },
      ],
    },
    schedule: [
      { day: "Various Days", time: "Throughout the Week", location: "Various locations around Greater Hartford" },
    ],
    contactEmail: "info@180lifechurch.org",
    externalLinks: [
      { label: "Find a Life Group", href: "https://180life.churchcenter.com/groups/180-life-groups", description: "Browse and join a group on Church Center" },
    ],
  },
  students: {
    title: "Student Ministry",
    subtitle:
      "Student Ministry for grades 6 through 12 in Greater Hartford.",
    slug: "students",
    showOnHomepage: true,
    homepageSortOrder: 20,
    card: {
      image: FALLBACK_CARD_IMAGE,
      tag: "Grades 6-12",
      description:
        "A place where teens can be themselves, ask tough questions, and discover what it looks like to follow Jesus.",
    },
    description: "<p>Our Student Ministry (Grades 6-12) partners with Wintonbury Church and their NextGen Youth Ministry. Our goal is to provide a safe place where students can feel comfortable sharing challenges during their teen years, help prepare them for their future by digging deeper into God's Word, and build relationships with trusted leaders.</p><p>Both Middle School and High School groups meet weekly and separately on two different days of the week. On Sunday mornings, students enjoy live worship in the adult service before connecting with small group leaders for lessons and activities.</p><p>We also have outings, service projects, retreats, and trips throughout the year. We are currently looking for additional leaders. If serving, inspiring, and encouraging the next generation to follow God is something God has put on your heart, please contact Chip to learn how you can be a part of 180 Life Students.</p>",
    schedule: [
      { day: "Friday", time: "6:30 - 8:30 PM", location: "Middle School" },
      { day: "Sunday", time: "5:30 - 8:00 PM", location: "High School" },
      { day: "Sunday", time: "9:00 AM & 11:00 AM", location: "Small groups during service" },
    ],
    contactEmail: "chip@180lifechurch.org",
  },
  "young-adults": {
    title: "Young Adults",
    subtitle:
      "Are you in your 20s or 30s and looking for community? Join our diverse group of Young Adults in the Greater Hartford area.",
    slug: "young-adults",
    showOnHomepage: true,
    homepageSortOrder: 50,
    card: {
      image: FALLBACK_CARD_IMAGE,
      tag: "Tuesdays",
      description:
        "For those in their 20s and 30s navigating life, faith, and community. We meet on Tuesdays.",
    },
    accentColor: "#818CF8",
    heroIcon: "Sparkles",
    heroPattern: "dots",
    verse: {
      text: "Don't let anyone look down on you because you are young, but set an example for the believers in speech, in conduct, in love, in faith and in purity.",
      reference: "1 Timothy 4:12",
    },
    description: "<p>Our young adults are passionate about Jesus and life! We seek to create an authentic place where you can be yourself, make lasting friendships, and encourage one another in the Christian life.</p><p>We hang out together, serve together (in and outside the church), play sports leagues together, and gather every Tuesday evening for worship, teaching, and small groups.</p><p>Ready to learn more about us? Join us for Young Adults Life Group on Tuesdays, or on the first Sunday of the month for lunch right after service! To get connected, reach out to Ben.</p>",
    featureCards: {
      label: "What to Expect",
      heading: "Faith, Friendship, Fun",
      cards: [
        {
          icon: "Music",
          label: "Worship & Word",
          description:
            "Tuesday nights of live worship, teaching that meets you where you are, and small group conversation.",
        },
        {
          icon: "Users",
          label: "Real Community",
          description:
            "Sports leagues, hangouts, monthly lunches, serving together - friendships that go beyond the building.",
        },
        {
          icon: "HandHeart",
          label: "On Mission",
          description:
            "Serve together inside and outside the church. Discover purpose for this stage of life.",
        },
      ],
    },
    schedule: [
      { day: "Tuesday", time: "6:30 PM", location: "180 Life Church" },
      { day: "First Sunday of the Month", time: "After Service", location: "Lunch together" },
    ],
    contactEmail: "ben@180lifechurch.org",
  },
  kids: {
    title: "Kids Ministry",
    subtitle:
      "Our mission is to partner with parents and caregivers to help lead their children into a relationship with Jesus and to grow in their faith.",
    slug: "kids",
    showOnHomepage: true,
    homepageSortOrder: 30,
    card: {
      image: FALLBACK_CARD_IMAGE,
      tag: "Nursery - 5th",
      description:
        "From nursery through 5th grade, your kids will experience age-appropriate Bible teaching in a safe, fun environment.",
    },
    description: "<p>Since no one has more potential to influence a child's relationship with God than his or her caretakers, we want to support you as you integrate Biblical truths into your children's everyday lives.</p><p>Our Sunday programming (Nursery through 5th Grade) is offered during both our 9 AM and 11 AM services and is designed specifically to reinforce truths about God in meaningful, developmentally appropriate ways for your child. Middle School (6th through 8th grade) programming is offered during our 11 AM service only.</p><p>Safety is our top priority. We perform a complete background check on anyone who serves with our children and youth. Serving teammates are trained on the policies in place to keep kids safe from check-in to check-out. Each child receives a name tag with a unique alphanumeric code that is changed each week to ensure we can contact families during service and children are returned to their rightful guardians.</p>",
    schedule: [
      { day: "Sunday", time: "9:00 AM & 11:00 AM", location: "Nursery through 5th Grade" },
      { day: "Sunday", time: "11:00 AM", location: "Middle School (6th through 8th Grade)" },
    ],
    contactEmail: "jennifer@180lifechurch.org",
    externalLinks: [
      { label: "Child Dedication Form", href: "https://180life.churchcenter.com/people/forms/298308", description: "Submit a child dedication request" },
      { label: "Kids Video Lessons", href: "https://www.youtube.com/channel/UCFBn8FidToPCTIE2F4FK_VQ", description: "180 Kids lessons on YouTube" },
      { label: "Preschool Curriculum", href: "https://drive.google.com/drive/folders/1Y6Ju81CK_9uxhY5a0S7SJniMQvk1ooEh", description: "Google Drive folder for preschool age group" },
      { label: "Elementary Curriculum", href: "https://drive.google.com/drive/folders/14BrOIECeTs3oDY0kO3ne3owUjwY2KAyf", description: "Google Drive folder for elementary age group" },
      { label: "Middle School Curriculum", href: "https://drive.google.com/drive/folders/1Z4ktw7V6XGnX1uYVzLwGtONhW2FrBS3_", description: "Google Drive folder for middle school age group" },
    ],
  },
  mens: {
    title: "Men's Ministry",
    subtitle:
      "Equipping men of all ages and walks of life to live on mission as godly men and leaders in their homes, church, community, and world.",
    slug: "mens",
    showOnHomepage: true,
    homepageSortOrder: 60,
    card: {
      image: FALLBACK_CARD_IMAGE,
      tag: "Various",
      description:
        "Men sharpening men through fellowship, accountability, and a Christ-centered pursuit of becoming better husbands, fathers, and leaders.",
    },
    description: "<p>\"Be on your guard; stand firm in the faith; be courageous; be strong. Do everything in love.\" (1 Corinthians 16:13-14)</p><p>Our church challenges, equips, and encourages men to love God and live lives that reflect His priorities and purposes at home, in our communities, and beyond.</p><p>We have life groups specifically for men here at 180 Life Church. One meets on Monday nights from 7 to 8:30 PM online and the other meets Friday morning from 6 to 7:30 AM at our church building on Still Road in Bloomfield.</p><p>Typical events each year include Men's Breakfast, Iron Sharpens Iron conference in March, a Summer BBQ, and a Fall Retreat.</p>",
    schedule: [
      { day: "Monday", time: "7:00 - 8:30 PM", location: "Online" },
      { day: "Friday", time: "6:00 - 7:30 AM", location: "180 Still Road, Bloomfield" },
    ],
    contactEmail: "info@180lifechurch.org",
  },
  womens: {
    title: "Women's Ministry",
    subtitle:
      "We seek to connect, encourage, and equip women to pursue a deep, transforming relationship with Christ.",
    slug: "womens",
    description: "<p>Through the study of His Word, through authentic relationships with others, and by engaging in ministry, we help women grow deeper in their faith.</p><p>A variety of Life Groups are offered for women to study God's Word together, grow in spiritual maturity, and enjoy fellowship with one another. Groups are ongoing throughout the year.</p><p>\"Pray & Play\" can help moms find what they have been missing: time in prayer, fellowship for themselves and for their kids, hope in God's promises, and support in a safe community of mothers who are leading the next generation for Jesus.</p><p>Every spring and fall the women at 180 Life gather for a retreat. This is a day we intentionally set aside for the Lord with personal prayer time, teaching, and worship. Every September, the ladies head to Camp Berea in New Hampshire for a women's retreat with optional activities like hiking, kayaking, archery, and more.</p>",
    schedule: [
      { day: "Various Days", time: "Throughout the Week", location: "Life Groups and Events" },
    ],
    contactEmail: "women@180lifechurch.org",
  },
  missions: {
    title: "Missions & Outreach",
    subtitle:
      "We seek to bring the love of Christ to a community and world in need of the Gospel.",
    slug: "missions",
    accentColor: "#14B8A6",
    heroIcon: "Globe",
    heroPattern: "rays",
    verse: {
      text: "Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.",
      reference: "Matthew 28:19",
    },
    description: "<p>At 180 Life we seek to bring the love of Christ to a community in need of the Gospel. We not only support local and worldwide missionaries, but we offer ways for the church body to participate in God's bigger story through mission trips. In the past we have traveled locally here in Connecticut, as well as Miami, West Virginia, and Haiti.</p><p>Whether you participate by yourself, with your family, or with friends, these trips are an opportunity to join in God's work among the nations.</p>",
    featureCards: {
      label: "How We Engage",
      heading: "Local, National, Global",
      cards: [
        {
          icon: "MapPin",
          label: "Local Outreach",
          description:
            "Serving our neighbors right here in the Greater Hartford area year-round.",
        },
        {
          icon: "Compass",
          label: "Mission Trips",
          description:
            "Past trips to Miami, West Virginia, and Haiti - opportunities for individuals, families, and groups.",
        },
        {
          icon: "Globe",
          label: "Missionaries We Support",
          description:
            "Partnering with workers around the world who are sharing the gospel where it's needed most.",
        },
      ],
    },
    processSteps: {
      label: "How You Join",
      heading: "From Heart to Field",
      steps: [
        { icon: "Heart", label: "Pray", description: "Ask God where He's calling you to engage" },
        { icon: "MessageCircle", label: "Connect", description: "Tell us - we'll match you to a trip or partner" },
        { icon: "BookOpen", label: "Train", description: "Pre-trip preparation and team building" },
        { icon: "Globe", label: "Go", description: "Step into God's bigger story" },
      ],
    },
    contactEmail: "info@180lifechurch.org",
  },
  "deaf-ministry": {
    title: "Deaf Ministry",
    subtitle:
      "Sign language interpreted services every Sunday morning.",
    slug: "deaf-ministry",
    accentColor: "#8B5CF6",
    heroIcon: "Ear",
    heroPattern: "waves",
    verse: {
      text: "And let the beauty of the Lord our God be upon us, and establish the work of our hands for us; Yes, establish the work of our hands.",
      reference: "Psalms 90:17",
    },
    description: "<p>180 Life Church provides a high quality, professional interpreter in American Sign Language every Sunday morning. We believe that every person deserves to experience worship, community, and the love of God in a language and format that is accessible to them.</p><p>For more information on our interpreted services or how you can serve on the team, please contact us by email.</p>",
    featureCards: {
      label: "Accessible Worship",
      heading: "Every Person, Every Service",
      cards: [
        {
          icon: "Ear",
          label: "Professional Interpretation",
          description:
            "Certified ASL interpreters every Sunday at both the 9 AM and 11 AM services.",
        },
        {
          icon: "Users",
          label: "Welcoming Community",
          description:
            "More than interpretation - full inclusion in worship, life groups, and church family.",
        },
        {
          icon: "HandHeart",
          label: "Serve on the Team",
          description:
            "Looking for interpreters and supporters to expand this ministry. Reach out if you're interested.",
        },
      ],
    },
    schedule: [
      { day: "Sunday", time: "9:00 AM & 11:00 AM", location: "Main Auditorium, ASL Interpreted" },
    ],
    contactEmail: "info@180lifechurch.org",
  },
  care: {
    title: "Care Ministry",
    subtitle:
      "We connect people to Christ-centered spiritual, emotional, and relational assistance.",
    slug: "care",
    accentColor: "#EC4899",
    heroIcon: "Heart",
    heroPattern: "waves",
    verse: {
      text: "Carry each other's burdens, and in this way you will fulfill the law of Christ.",
      reference: "Galatians 6:2",
    },
    description: "<p>Depending on your needs, our Care Ministry may minister to you by walking alongside you through a difficult time, helping you develop discipleship relationships, connecting you to other ministries in the church, encouraging you with the truth of Scripture, recommending helpful books, sermons, and online articles, or referring you to a professional Christian counselor.</p><p>Our Pastoral Care team offers hospital visitation and funerals, premarital counseling and weddings, and baby and child dedications.</p><p>Helping Hands is active and provides meals to families welcoming new babies, an illness, or death. Helping Hammers seeks to be the hands and feet of Jesus by using skills and talents to address practical needs within 180 Life Church, like home projects and maintenance.</p>",
    featureCards: {
      label: "Ways We Care",
      heading: "Walking Together Through Every Season",
      cards: [
        {
          icon: "Heart",
          label: "Pastoral Care",
          description:
            "Hospital visits, funerals, premarital counseling, weddings, and baby dedications.",
        },
        {
          icon: "HandHeart",
          label: "Helping Hands",
          description:
            "Meals for families welcoming new babies, navigating illness, or grieving a loss.",
        },
        {
          icon: "Shield",
          label: "Helping Hammers",
          description:
            "Hands-on practical help - home projects, maintenance, and skilled labor for those who need it.",
        },
      ],
    },
    callout: {
      icon: "MessageCircle",
      heading: "Need Someone to Walk With You?",
      body: "<p>You don't have to navigate hard seasons alone. Whether it's a crisis, a quiet struggle, or just needing a listening ear - reach out. Our Care Ministry will connect you with the right next step, whether that's a meal, a visit, a counselor referral, or a friend to pray with you.</p><p>All conversations stay confidential within our pastoral team.</p>",
    },
    contactEmail: "info@180lifechurch.org",
  },
  prayer: {
    title: "Prayer Ministry",
    subtitle:
      "Prayer is a vital part of our relationship with God, as individuals and a church community.",
    slug: "prayer",
    accentColor: "#6366F1",
    heroIcon: "Flame",
    heroPattern: "crosses",
    verse: {
      text: "Devote yourselves to prayer, being watchful and thankful.",
      reference: "Colossians 4:2",
    },
    description: "<p>As believers, it is a privilege and responsibility to thank God for all He is doing among us and to intercede for God's wisdom, direction, and provision in the needs of our community, our church, our ministries, and our people.</p><p>We have seen lives changed and transformed through the power of prayer and our team is dedicated to lifting up the needs of the church corporately and individually.</p><p>Join us for Pre-Service Prayer on Sunday mornings from 9:15 to 9:45 AM. All are welcome to attend! Look for the \"Pre-Service Prayer\" banner.</p><p>If you share a similar passion for prayer and are a member, please email us to join our team.</p>",
    featureCards: {
      label: "How We Pray",
      heading: "A Praying Church",
      cards: [
        {
          icon: "Flame",
          label: "Pre-Service Prayer",
          description:
            "Sundays 9:15–9:45 AM. All welcome. Praying for the services, the church, and one another.",
        },
        {
          icon: "Heart",
          label: "Personal Prayer",
          description:
            "Reach out anytime - our team prays confidentially over needs in your life and family.",
        },
        {
          icon: "Users",
          label: "Join the Team",
          description:
            "Members with a heart for prayer are invited to join the intercessory team that lifts the church.",
        },
      ],
    },
    schedule: [
      { day: "Sunday", time: "9:15 - 9:45 AM", location: "Pre-Service Prayer" },
    ],
    contactEmail: "info@180lifechurch.org",
  },
  serving: {
    title: "Serving",
    subtitle:
      "Discover your role. One of the primary ways of connecting into the life of 180 Life Church is to serve.",
    slug: "serving",
    showOnHomepage: true,
    homepageSortOrder: 40,
    card: {
      image: FALLBACK_CARD_IMAGE,
      tag: "Multiple Teams",
      description:
        "Discover how God has wired you with gifts and passions to make a difference in the church, community, and the world.",
    },
    accentColor: "#F59E0B",
    heroIcon: "HandHeart",
    heroPattern: "rays",
    verse: {
      text: "Each of you should use whatever gift you have received to serve others, as faithful stewards of God's grace in its various forms.",
      reference: "1 Peter 4:10",
    },
    description: "<p>Our desire is to help believers discover how God has uniquely wired them with gifts, talents, and passions and to equip people to magnify God by serving in their church, community, and the world.</p><p>When you decide to make 180 Life Church your church home, we hope that service will become a part of your life's worship. There are many serving opportunities: setting up on a Sunday morning, greeting and ushering, hospitality, audio-visual, worship, participating in the Kids Ministry, and many more.</p><p>\"God is not unjust; he will not forget your work and the love you have shown him as you have helped his people and continue to help them.\" (Hebrews 6:10, NIV)</p>",
    featureCards: {
      label: "Where to Plug In",
      heading: "Discover Your Role",
      cards: [
        {
          icon: "Sun",
          label: "Sunday Mornings",
          description:
            "Set-up, greeters, ushers, hospitality, parking - the team that opens the doors every week.",
        },
        {
          icon: "Music",
          label: "Worship & Tech",
          description:
            "Worship team, sound, lighting, video, slides - the people who shape the room.",
        },
        {
          icon: "Baby",
          label: "Kids Ministry",
          description:
            "Background-checked teammates pouring into the next generation in nursery, preschool, and elementary.",
        },
        {
          icon: "MessageCircle",
          label: "Guest Center",
          description:
            "Welcoming first-time visitors, answering questions, and helping people take their next step.",
        },
      ],
    },
    processSteps: {
      label: "Your Journey",
      heading: "How to Start Serving",
      steps: [
        { icon: "Compass", label: "Apply", description: "Fill out the serving form on Church Center" },
        { icon: "MessageCircle", label: "Interview", description: "Meet briefly with the team lead" },
        { icon: "BookOpen", label: "Train", description: "Hands-on training for your specific role" },
        { icon: "HandHeart", label: "Serve", description: "Step into your role and grow alongside others" },
      ],
    },
    contactEmail: "info@180lifechurch.org",
    externalLinks: [
      { label: "Apply to Serve", href: "https://180life.churchcenter.com/people/forms/405849", description: "Fill out the serving application on Church Center" },
    ],
  },
  "marriage-prep": {
    title: "Marriage Prep",
    subtitle:
      "It is our goal at 180 Life Church to help you prepare for a successful marriage that glorifies God.",
    slug: "marriage-prep",
    accentColor: "#F43F5E",
    heroIcon: "HeartHandshake",
    heroPattern: "mountains",
    verse: {
      text: "Therefore what God has joined together, let no one separate.",
      reference: "Mark 10:9",
    },
    description: "<p>Congratulations on your engagement! We are very excited for you! This is a joyous occasion and we are excited to walk with you as you prepare for marriage.</p><p>While the coming months will be very busy with wedding planning and preparations, it is equally important to be preparing your relationship for a healthy and God-honoring marriage.</p><p>Step 1: We will need a few details to help get things started. Let us know a wedding date, location, and to request a pastor to officiate the ceremony.</p><p>Step 2: All couples are required to participate in premarital counseling with a biblical counselor. Premarital counseling should begin 4 to 6 months before the wedding date. There are typically 5 to 6 sessions scheduled every other week, so it will require 3 months to complete the premarital counseling process.</p>",
    featureCards: {
      label: "Your Journey",
      heading: "How We Walk Alongside You",
      cards: [
        {
          icon: "Calendar",
          label: "Start 4–6 Months Out",
          description:
            "Premarital counseling begins 4 to 6 months before the wedding so you have time to do the work well.",
        },
        {
          icon: "BookOpen",
          label: "Biblical Counseling",
          description:
            "5–6 sessions with a trained biblical counselor - communication, finances, conflict, faith, family.",
        },
        {
          icon: "HeartHandshake",
          label: "A Pastor's Care",
          description:
            "One of our pastors officiates the ceremony and walks with you into your first year of marriage.",
        },
      ],
    },
    processSteps: {
      label: "Your Path",
      heading: "From Engaged to Married",
      steps: [
        { icon: "MessageCircle", label: "Reach Out", description: "Share your wedding date and request a pastor" },
        { icon: "BookOpen", label: "Begin Counseling", description: "Start 4–6 months before the wedding" },
        { icon: "Heart", label: "Wedding Day", description: "A 180 Life pastor officiates the ceremony" },
        { icon: "HeartHandshake", label: "First Year", description: "Ongoing pastoral care into your marriage" },
      ],
    },
    contactEmail: "info@180lifechurch.org",
  },
};

// ---------------------------------------------------------------------------
// Content Pages
// ---------------------------------------------------------------------------

export const CONTENT_PAGES: Record<string, ContentPageData> = {
  about: {
    title: "About 180 Life Church",
    slug: "about",
    subtitle:
      "We exist to make and send disciples who love and live like Jesus.",
    breadcrumbs: [{ label: "About", href: "/about" }],
    card: {
      tag: "Our Story",
      title: "About",
      description: "Mission, history, and what to expect on a Sunday.",
    },
    sections: [
      {
        label: "Our Mission",
        heading: "Following, Changing,",
        headingAccent: "Committed",
        body: "<p>We exist to make and send disciples who love and live like Jesus. This is the mission of our church and everything that we do is filtered through that lens. Our goal is to live out the great commission and to spread the Good News to the ends of the earth.</p><p>\"And he said to them, 'Follow me, and I will make you fishers of men.'\" (Matthew 4:19)</p><p>180 Life Church members have an intentional relationship with God, His people, and the community. Following Jesus changes us, producing spiritual growth. We are committed to Jesus and actively discipling others.</p>",
        image: { src: "/images/community.jpg", alt: "Church community" },
      },
      {
        label: "Our Story",
        heading: "How It All",
        headingAccent: "Started",
        body: "<p>180 Life Church is a non-denominational church that started in 2005 when Pastor Bill LaMorey and his wife Rebecca felt called to leave Florida and plant a church in Connecticut. They had a vision to see lives changed by Jesus, and before long, a small group of people started meeting for church at Elmwood Community Center in West Hartford. Through prayer and persistence, the church grew over time, eventually settling into Conard High School for weekly services for 16 years.</p><p>After 18 years of faithful service, God called Pastor Bill and Rebecca back to Florida, and in August 2023 Josh Poteet joined staff as Lead Pastor.</p><p>In June of 2025 we acquired our first building that sits on the Bloomfield/West Hartford line located at 180 Still Road. Services in the new space kicked off in November 2025 and we have fully embraced the blessing that the building is as a tool for ministry.</p><p>Our church is part of the Greater Hartford area, which is full of rich history and diverse communities. It is a place where people from all walks of life can come together, and our church family shares the good news of Jesus with everyone from neighbors to co-workers.</p>",
        image: {
          src: "/images/ministries/serving.jpg",
          alt: "Community outreach",
          position: "left",
        },
      },
      {
        label: "Sundays",
        heading: "What to",
        headingAccent: "Expect",
        body: "<p>Our building is located at 180 Still Road in Bloomfield. Doors open at 8:40 AM and church begins at 9 AM for our first service and 11 AM for service two. Please arrive earlier to get yourself settled. If you have children, this ensures ample time to check them into the kids ministry.</p><p>We want you to feel the freedom to come as you are. Some people dress up while others dress casually. Join us in an outfit that you are comfortable in.</p><p>We start with worship, announcements, followed by a message. Each service lasts about 75 minutes.</p><p>If you are new, be sure to head over to the guest center after church where we have a special gift for you and we can answer any of your questions. Do not forget to join us after service for free coffee and refreshments. This is a great way to meet other folks at 180 Life Church.</p>",
      },
    ],
    cta: {
      heading: "Got Questions?",
      description:
        "We are here to help with your questions about Jesus, our church, and your own spiritual growth.",
      text: "Ask Now",
      link: "/contact",
    },
  },
  partnership: {
    title: "Partnership",
    slug: "partnership",
    subtitle:
      "Discover who we are as a church and how God uniquely designed you to be part of the church body.",
    breadcrumbs: [{ label: "Partnership", href: "/partnership" }],
    accentColor: "#D4A054",
    heroIcon: "HeartHandshake",
    heroPattern: "network",
    verse: {
      text: "Just as each of us has one body with many members, and these members do not all have the same function, so in Christ we, though many, form one body, and each member belongs to all the others.",
      reference: "Romans 12:4-5",
    },
    card: {
      tag: "Membership",
      title: "Partnership",
      description:
        "Learn how to become a partner and discover your place in the church body.",
    },
    sections: [
      {
        label: "Partner With Us",
        heading: "Your Place in",
        headingAccent: "the Church Body",
        body: "<p>In our two-week Partnership class, we unpack our beliefs, what the Bible says about the church body, and how you fit into the local church. You will have an opportunity to fill out a spiritual gifts assessment to see how your gifts can be used to serve the body.</p><p>Have questions about 180 Life Church or the Bible? This is the perfect class to come, learn, and ask. Our goal is to continue partnering with you on the mission to make and send disciples who love and live like Jesus.</p>",
        image: {
          src: "/images/ministries/life-groups.jpg",
          alt: "Partnership class discussion",
          position: "right",
        },
      },
    ],
    featureCards: {
      label: "What to Expect",
      heading: "Two Weeks, Real Conversation",
      cards: [
        {
          icon: "BookOpen",
          label: "What We Believe",
          description:
            "Our doctrinal foundations and what shapes how we worship, teach, and follow Jesus together.",
        },
        {
          icon: "Users",
          label: "The Body",
          description:
            "What Scripture says about church membership and why partnership is more than attendance.",
        },
        {
          icon: "Sparkles",
          label: "Spiritual Gifts",
          description:
            "Take a gifts assessment, see how God has wired you, and find where you fit in our ministries.",
        },
        {
          icon: "MessageCircle",
          label: "Ask Anything",
          description:
            "Bring your questions about God, the Bible, or our church. Nothing is off-limits here.",
        },
      ],
    },
    processSteps: {
      label: "Your Path",
      heading: "From Visitor to Partner",
      steps: [
        {
          icon: "Coffee",
          label: "Attend",
          description: "Worship with us a few Sundays and feel the room.",
        },
        {
          icon: "Calendar",
          label: "Sign Up",
          description: "Register for our next 2-week Partnership class.",
        },
        {
          icon: "BookOpen",
          label: "Learn",
          description: "Walk through beliefs, spiritual gifts, and the church body.",
        },
        {
          icon: "HeartHandshake",
          label: "Commit",
          description: "Become a partner and step into your role here.",
        },
      ],
    },
    cta: {
      heading: "Ready to Partner?",
      description:
        "Be on the lookout for our next class, or reach out and we will let you know when the next cohort starts.",
      text: "Contact Us",
      link: "/contact",
    },
  },
  baptism: {
    title: "Baptism & Dedication",
    slug: "baptism",
    subtitle:
      "A public declaration of an inward transformation.",
    breadcrumbs: [{ label: "Baptism", href: "/baptism" }],
    accentColor: "#0EA5E9",
    heroIcon: "Cross",
    heroPattern: "waves",
    verse: {
      text: "Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.",
      reference: "Matthew 28:19",
    },
    card: {
      tag: "Next Step",
      title: "Baptism & Dedication",
      description:
        "Ready to take your next step of faith? Learn about baptism and child dedication.",
    },
    sections: [
      {
        label: "Your Next Step",
        heading: "What is",
        headingAccent: "Baptism?",
        body: "<p>Baptism is a public declaration of an inward transformation. It is a command from Christ (Matthew 28:19) and an act of obedience. If you are a follower of Jesus and have never been baptized, we encourage you to take this next step in your faith journey!</p>",
        image: {
          src: "/images/hero-worship.jpg",
          alt: "Worship at 180 Life Church",
          position: "right",
        },
      },
      {
        heading: "Are You",
        headingAccent: "Ready?",
        body: "<p>If you feel that you are ready to take this next step in your faith journey, sign up for our next baptism! Let us know you are interested or if you have any questions.</p>",
      },
      {
        label: "Families",
        heading: "Child",
        headingAccent: "Dedication",
        body: "<p>Child Dedication is a public commitment parents make before God, the church, and their family. The dedication provides parents an opportunity to express their desire to lead and spiritually nurture their child to know God and encourage them to establish a personal relationship with Jesus Christ.</p><p>Attending a Child Dedication Parent Meeting is a requirement before the Child Dedication Ceremony. If you are interested in dedicating your child on a Sunday morning, please reach out and our Children's Ministry Director will be in touch with you about next steps.</p>",
        image: {
          src: "/images/ministries/kids.jpg",
          alt: "Children's ministry at 180 Life Church",
          position: "left",
        },
      },
    ],
    featureCards: {
      label: "Why Baptism Matters",
      heading: "More Than a Symbol",
      cards: [
        {
          icon: "Cross",
          label: "An Act of Obedience",
          description:
            "Jesus commanded baptism for those who follow Him. It is one of the first things He asks new believers to do.",
        },
        {
          icon: "Sparkles",
          label: "A Public Declaration",
          description:
            "Baptism announces to family, friends, and the church that your life now belongs to Jesus.",
        },
        {
          icon: "Heart",
          label: "An Inward Transformation",
          description:
            "Going under the water and rising out of it mirrors the death and resurrection of Christ in your own story.",
        },
      ],
    },
    processSteps: {
      label: "How It Works",
      heading: "Your Baptism Journey",
      steps: [
        {
          icon: "MessageCircle",
          label: "Tell Us",
          description: "Sign up or reach out so we know you want to be baptized.",
        },
        {
          icon: "BookOpen",
          label: "Conversation",
          description: "A pastor sits down with you to hear your story and answer questions.",
        },
        {
          icon: "Calendar",
          label: "Pick a Date",
          description: "We schedule baptisms on regular Sundays throughout the year.",
        },
        {
          icon: "Cross",
          label: "Celebrate",
          description: "Get baptized in front of the church family. Bring everyone.",
        },
      ],
    },
    callout: {
      icon: "Baby",
      heading: "Have a question about child dedication?",
      body: "<p>Child Dedication is for parents who want to publicly commit to raising their kids in the faith. It is not the same as infant baptism, but it is a meaningful moment for your family and church family alike. Reach out and our Children's Ministry Director will walk you through the next steps.</p>",
    },
    cta: {
      heading: "Interested in Baptism or Dedication?",
      description:
        "Congratulations! We would love to celebrate this step with you.",
      text: "Sign Up for Baptism",
      link: "https://180life.churchcenter.com/registrations/events/3506531",
    },
  },
  stories: {
    title: "Stories",
    slug: "stories",
    subtitle:
      "Jesus changes everything. Here is what that looks like in real lives at 180 Life Church.",
    breadcrumbs: [{ label: "Stories", href: "/stories" }],
    accentColor: "#EC4899",
    heroIcon: "Heart",
    heroPattern: "dots",
    verse: {
      text: "They triumphed over him by the blood of the Lamb and by the word of their testimony.",
      reference: "Revelation 12:11",
    },
    card: {
      tag: "Testimonies",
      title: "Stories",
      description: "See how God is transforming lives at 180 Life Church.",
    },
    sections: [
      {
        label: "Testimonies",
        heading: "Lives",
        headingAccent: "Changed",
        body: "<p>Take a look at these short videos to see how God is transforming the lives of 180 Life members! Check out our YouTube channel for the full playlist.</p>",
        image: {
          src: "/images/community.jpg",
          alt: "180 Life Church community",
          position: "right",
        },
      },
      {
        label: "Your Story",
        heading: "Share Your",
        headingAccent: "Story",
        body: "<p>Our lives are each unfolding stories that hold incredible power. Whether you are in a great chapter or a challenging chapter, God can use your story to encourage, challenge, and build up those who hear it.</p><p>We believe collecting the stories of our people is a sacred work that can impact not only this generation, but those to come, and we would be honored to hear yours and add it to our library. Your story can be as simple as a few sentences about what God is doing in your life at the moment or your entire journey.</p>",
      },
    ],
    cta: {
      heading: "Have a Story to Share?",
      description:
        "We would love to hear how God has been working in your life.",
      text: "Share Your Story",
      link: "/contact",
    },
  },
  "immeasurably-more": {
    title: "Immeasurably More",
    slug: "immeasurably-more",
    subtitle:
      "The vision, story, and goal behind 180 Life Church's capital campaign for our new home at 180 Still Road.",
    breadcrumbs: [
      { label: "Give", href: "/give" },
      { label: "Immeasurably More", href: "/immeasurably-more" },
    ],
    accentColor: "#D4A054",
    heroIcon: "Mountain",
    heroPattern: "mountains",
    verse: {
      text: "Now to him who is able to do immeasurably more than all we ask or imagine, according to his power that is at work within us, to him be glory in the church and in Christ Jesus throughout all generations.",
      reference: "Ephesians 3:20-21",
    },
    heroImage: "/images/hero-worship.jpg",
    card: {
      tag: "Capital Campaign",
      title: "Immeasurably More",
      description:
        "The vision, story, and goal behind 180 Life Church's capital campaign for our new home at 180 Still Road.",
    },
    sections: [
      {
        label: "Our Vision",
        heading: "Twenty Years.",
        headingAccent: "One Home.",
        body:
          "<p>For 20 years, 180 Life Church has been creating a spiritual wake in one of the most unreached places in America, awakening those asleep to the truth. We've battled homelessness, improved foster care, and served our community - all while operating as <strong>spiritual nomads</strong>, gathering as a church from basements to schools.</p><p>Now, God is removing obstacles as we move forward, <strong>securing a home for the mission Jesus has given us.</strong></p>",
      },
      {
        label: "Why a Building",
        heading: "Faith Beyond",
        headingAccent: "Sunday",
        body:
          "<p>People need faith beyond Sunday - a faith for every day's challenges. Without a building, we can't fully minister throughout the week, which leaves us unable to meet the spiritual needs of our community. Having a home will empower us to <strong>engage our congregation, reach the lost, and send disciples.</strong></p><p>The cost to operate out of Conard High School has been nearly $90,000 a year - significant, especially when you factor in that we use the facility for only a few hours each Sunday. The largest stressor isn't the money, though. It's that mobile-church life limits ministry to Sundays and puts a constant toll on the staff and volunteers who handle setup and teardown. Having our own space frees us up to have a far larger Kingdom impact.</p>",
        image: {
          src: "/images/community.jpg",
          alt: "180 Life Church community at worship",
          position: "right",
        },
      },
      {
        label: "The Opportunity",
        heading: "100",
        headingAccent: "and 1",
        body:
          "<p>Our prayer is for <strong>100 and 1</strong>. That represents <strong>100% church engagement</strong> as we raise <strong>more than $1 million</strong> through this campaign - above and beyond your regular tithe and offerings.</p><p>The total project cost is approximately $4.3 million. We already have $1.2 million from past building savings, and we'll combine campaign funds with a $1 million loan to cover the purchase and renovation of our future church home. The purchase and Phase 1 (bathrooms, parking lot, kids' space) are already covered - renovations to the worship center and fellowship hall happen as campaign funds come in.</p><blockquote>It is through sacrificial giving and unified commitment that each of us can contribute to bringing this vision to fruition. Together, let us steadfastly pursue God's plan for our church and community with faith and determination.</blockquote>",
      },
      {
        label: "5-Year Kingdom Impact",
        heading: "What This",
        headingAccent: "Makes Possible",
        body:
          "<p>A building isn't the goal - it's the tool. Here's what we believe God will do through this space over the next five years:</p><ul><li><strong>Kids</strong> - 125+ kids hearing about Jesus' love, with parents baptizing their own children (currently 70 kids attending)</li><li><strong>Life Groups</strong> - 300+ people connected (currently 160 adults participating)</li><li><strong>Baptisms</strong> - 175 baptisms over five years (~30 in 2024)</li><li><strong>Student Ministry</strong> - 45+ students learning to love and live like Jesus (currently 15 attending)</li><li><strong>Young Adults</strong> - 45+ meeting weekly as disciple-makers (10–15 meet 2–3× monthly today)</li><li><strong>Men's &amp; Women's Ministry</strong> - church-hosted Bible studies, retreats, and gatherings throughout the week</li><li><strong>\"As It Is in Heaven\" Fund</strong> - $100K+ annually toward strategic partnerships locally and internationally ($66,800 in 2024)</li><li><strong>Discipleship</strong> - 70% church engagement in making and sending disciples</li></ul>",
      },
      {
        label: "Get Involved",
        heading: "Seek. Listen.",
        headingAccent: "Obey.",
        body:
          "<p><strong>Seek.</strong> Think of and pray for lost friends and neighbors. Ask God how He might use you and our church to build relationships. Ask God what your part might be in supporting this campaign.</p><p><strong>Listen.</strong> Hear God's call. Consider how you can contribute your time and resources to this campaign.</p><p><strong>Obey.</strong> Act now. Steward your resources wisely and prepare to support God's work through our church.</p>",
      },
      {
        label: "Frequently Asked",
        heading: "Common",
        headingAccent: "Questions",
        body:
          "<p><strong>Why do we believe this is the will of God?</strong><br />Throughout the Bible, we see a recurring theme of God guiding His people to establish places of gathering and worship. In Exodus 36, Moses led the Israelites in constructing the sanctuary, where the people were so enthusiastic and generous that Moses had to restrain their offerings. Our own space enhances our presence in the community and demonstrates the stability we wish to convey to the world. This journey has spanned 20 years for our church, during which we patiently awaited God's direction.</p><p><strong>What does \"100 and 1\" mean?</strong><br />Our God-sized goal for this building campaign - 100% of the church engaging in raising above $1 million toward the purchase and renovation of our future church home.</p><p><strong>How long do we project it will take to pay it off?</strong><br />It's a 25-year loan, but payments will be less than our current rent. The goal is to pay it off in 10–15 years. The growth that often comes with having a building could make this happen even faster.</p><p><strong>Do we have to raise a certain amount before we break ground?</strong><br />No. The building is already built, and we have enough funds to purchase and begin Phase 1 (bathrooms, parking lot, and kids' space). Updates to the fellowship hall and worship center will take place as funds come in from the campaign.</p><p><strong>What happens if we don't reach the goal?</strong><br />Phase II renovations are directly tied to funds raised. We've raised enough to purchase the property and begin Phase 1; if we don't reach the goal, Phase II will be delayed.</p><p><strong>How long are pledges?</strong><br />Pledges are typically made over a 3-year period. The campaign launched October 6, 2024 - and we could still use help reaching our goal.</p><p><strong>Can I give stocks, real estate, or other assets?</strong><br />Yes. Transferring ownership of appreciated assets (stocks, bonds, real estate, automobiles, etc.) directly to the church can eliminate capital gains taxes and significantly increase your after-tax proceeds. Tax codes are generous toward this form of giving.</p>",
      },
    ],
    cta: {
      heading: "Make a Pledge",
      description:
        "Commit to a multi-year pledge through Church Center, or make a one-time gift now. Every gift moves us closer to 100 and 1.",
      text: "Make Your Pledge",
      link: "https://180life.churchcenter.com/people/forms/28729",
    },
  },
  "new-to-faith": {
    title: "New to Faith",
    slug: "new-to-faith",
    subtitle:
      "Just gave your life to Christ, or just curious? You are in good company. Here is what comes next.",
    breadcrumbs: [{ label: "New to Faith", href: "/new-to-faith" }],
    heroImage: "/images/community.jpg",
    accentColor: "#10B981",
    heroIcon: "Sparkles",
    heroPattern: "rays",
    verse: {
      text: "Therefore, if anyone is in Christ, he is a new creation. The old has passed away; behold, the new has come.",
      reference: "2 Corinthians 5:17",
    },
    card: {
      tag: "Just Starting",
      title: "New to Faith",
      description:
        "Just gave your life to Christ, or just curious? Start with a Bible, prayer, and a real person to walk alongside you.",
    },
    featureCards: {
      label: "Four Anchors",
      heading: "Four Things to Build On",
      cards: [
        {
          icon: "BookOpen",
          label: "The Bible",
          description:
            "God's love letter to you. We will send you a physical Bible of your own as a gift, no strings.",
        },
        {
          icon: "Flame",
          label: "Prayer",
          description:
            "Prayer is talking with God, anywhere, any time. Start with a few minutes a day.",
        },
        {
          icon: "Users",
          label: "Community",
          description:
            "This life was meant to be lived alongside others. A Life Group is the easiest first step.",
        },
        {
          icon: "Heart",
          label: "Service",
          description:
            "Faith grows when it has hands. Serving the people around you is part of how we mature.",
        },
      ],
    },
    sections: [
      {
        label: "We Are Here to Help",
        heading: "Starting Your",
        headingAccent: "Journey",
        body: "<p>Did you recently give your life to Christ or do you have questions about the Christian faith? We are here to help! We want to send you a Bible, answer your questions, pray for you, and schedule a time to meet up in person if you would like.</p><p>It is God's desire to have a relationship with you and for you to have a strong relationship with other believers. The four areas below can help as you continue along your spiritual journey.</p>",
      },
      {
        heading: "Biblical",
        headingAccent: "Resources",
        body: "<p>We would love to send you a physical Bible of your own! This is our gift to you. In the meantime, or if you prefer digital access, check out Bible Gateway (biblegateway.com), Bible Hub (biblehub.com), ESV Online (esv.org), and the YouVersion Bible App.</p><p>To grow in your faith, it is important to maintain a daily time of spending time with God through reading your Bible and prayer. YouVersion Bible App Reading Plans and Our Daily Bread Devotionals are great places to start.</p>",
      },
      {
        heading: "Connect",
        headingAccent: "With Us",
        body: "<p>Your friends at 180 Life would love to engage and connect with you! We believe that this life was meant to go through together.</p><p>180 Life Groups are an essential part of 180 Life Church and a great way to get to know people. Groups are typically 10 to 15 people, meeting once a week. There are groups on different days and times of the week.</p>",
      },
    ],
    cta: {
      heading: "What Would You Like to Learn?",
      description:
        "How would you like to grow? Reach out to us because we are here for you.",
      text: "Talk to Someone",
      link: "/contact",
    },
  },
};

// ---------------------------------------------------------------------------
// Leadership
// ---------------------------------------------------------------------------

export const LEADERSHIP_DATA: LeadershipData = {
  pastors: [
    {
      name: "Josh Poteet",
      role: "Lead Pastor",
      image: "https://180lifechurch.org/wp-content/uploads/2023/08/josh-1.png",
      bio: "Born in Ohio, Josh grew up in Florida. He and Jennie tied the knot in 2015 and they now have two kids, Lilla and Ezra. Prior to ministry, Josh worked in the Army National Guard Infantry and as an EMT. Since then, he completed his Masters in Theological Studies and has been serving within the local church. Josh is a deep believer in relational discipleship. He personally experienced tremendous life change through discipleship and it is now his passion to create and multiply that culture wherever he goes.",
    },
    {
      name: "Nicholas Leadbeater",
      role: "Pastor for Ministry Development",
      image: "https://180lifechurch.org/wp-content/uploads/2023/08/Nic1.png",
      bio: "While now living in New England, Nicholas is a native of old England. His family is from Birmingham in the center of the UK. After working at a University in London for five years as a Chemistry Professor, he had the opportunity to move to the University of Connecticut. Nicholas and his wife Susan live in Southington. They have been a part of the church since 2006. He was ordained in 2019 and often gets to put his teaching hat on, giving some Sunday morning messages.",
    },
  ],
  staff: [
    {
      name: "Chip Anthony",
      role: "Operations and Student Ministry Director",
      image: "https://180lifechurch.org/wp-content/uploads/2023/08/chip1.png",
      bio: "Born and raised in Connecticut, Chip attended college right down the road from the church in West Hartford. He found the church in January 2006 and felt that it was a place he could truly feel God moving. He joined staff in June 2009. Some of his duties include operations, partnership, life groups, students, and special events. Chip is married to Amanda and they reside in Farmington, CT with their two sons Christian and Thomas.",
    },
    {
      name: "Jennifer Byrne",
      role: "Children's Ministry Director",
      image: "https://180lifechurch.org/wp-content/uploads/2023/08/Jen1.png",
      bio: "Jen joined the team as the Children's Ministry Director in May 2022 but has been attending 180 Life Church since 2008. Originally from a small farm town in Illinois, Jen is passionate about serving the local community, hosting kids and families, and supporting moms and families in this parenting journey. She lives in West Hartford with her husband Jeremy and three daughters Johanna, Julianne, and Jade.",
    },
    {
      name: "Ben Valentine",
      role: "Director of Worship & Young Adults",
      image: "https://180lifechurch.org/wp-content/uploads/2024/05/Untitled-design80.png",
      bio: "Born and raised in the Natural State, Ben recently moved to Connecticut with his wife Grace. He has a passion for leading Christ-centered worship that ushers people into the presence of God, and to see Young Adults emboldened and equipped to be the hands and feet of Jesus making and sending disciples.",
    },
    {
      name: "Emily Oaks",
      role: "Women's Ministry Director",
      image: "https://180lifechurch.org/wp-content/uploads/2026/02/DSCF3528-2.jpg",
      bio: "Emily grew up in Connecticut and is grateful to now call West Hartford home. She first began attending 180 Life Church in 2017. In the fall of 2025, she stepped into the role of Women's Ministry Director. She is passionate about serving the Lord, growing in her own faith, and walking in relationships with others. Outside of church, she is an elementary school teacher in West Hartford.",
    },
    {
      name: "Jim Richert",
      role: "Men's Ministry Director",
      image: "https://180lifechurch.org/wp-content/uploads/2026/03/Life1803of15-2.jpg",
      bio: "Jim is an elder and a lifelong follower of Christ who has been attending 180 Life Church since 2012. Originally from upstate New York, Jim has been married to his best friend Tanya since 2000 and is a dad to three amazing adult children (Caleb, Faith, and Noah). Jim's work focuses on the unique needs of making and sending men as disciples and exhorting them to step up in all areas of their life.",
    },
    {
      name: "Tinisha Noah",
      role: "Middle School Curriculum Coordinator",
      image: "https://180lifechurch.org/wp-content/uploads/2026/02/DSCF3625-2.jpg",
      bio: "Born and raised in Newfoundland, Canada, Tinisha moved to Connecticut in 2017. She resides in Windsor, CT and is married to her husband Blessing Noah. They have three young kids: Grace, Seth, and Trinity. Tinisha joined the Kids Ministry Team in March 2024. She has a passion for Kids and Youth Ministry and a desire to see the next generation know and love God.",
    },
    {
      name: "Ashley Perri",
      role: "Kids Curriculum Specialist",
      image: "https://180lifechurch.org/wp-content/uploads/2022/06/360_F_622414122_8SjZepAxG7hRr66C7APlMQPkCUJVH5tu.jpg",
      bio: "Ashley is our Kids Curriculum Specialist for ages birth through 5th grade. She received her bachelor's degree in middle school math and science education from Valparaiso University in 2009. She and her husband Ryan are both originally from the Chicago area but have called Farmington home since 2020. They have 3 boys: Jackson, Wyatt, and Miles.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Elders
// ---------------------------------------------------------------------------

export const ELDERS = [
  { name: "Jeff Doot", role: "Secretary", image: "https://180lifechurch.org/wp-content/uploads/2023/12/Life18014of15.jpg" },
  { name: "Sam Kim", role: "Elder", image: "https://180lifechurch.org/wp-content/uploads/2023/12/Life18015of15.jpg" },
  { name: "Jim Richert", role: "Chair", image: "https://180lifechurch.org/wp-content/uploads/2023/12/Life1803of15.jpg" },
  { name: "Jose Rios", role: "Treasurer", image: "https://180lifechurch.org/wp-content/uploads/2025/06/Screenshot-2025-06-11-at-9.47.26%E2%80%AFPM-e1749693037632.png" },
];

export const ELDERS_DESCRIPTION =
  "The Elders provide intentional shepherding within the church body and offer accountability and counsel to the Lead Pastor regarding major financial and strategic decisions. Their role is to facilitate alignment toward our mission of making disciples.";

export const ELDERS_EMAIL = "elders@180lifechurch.org";

// ---------------------------------------------------------------------------
// Sermon Series -- populated from Church Center channel 12038
// Series with YouTube IDs have embedded video players.
// Series without YouTube IDs link out to Church Center for viewing.
// ---------------------------------------------------------------------------

const CC_SERIES = "https://180life.churchcenter.com/channels/12038/series";

export const SERMON_SERIES: Record<string, SermonSeriesData> = {
  "concrete-relationship": {
    title: "Concrete Relationship",
    subtitle: "Building something that lasts with the people who matter most.",
    slug: "concrete-relationship",
    image: "https://i.ytimg.com/vi/YpB93Bgu8m0/hqdefault.jpg",
    dateRange: "April 5, 2026 - Present",
    churchCenterUrl: `${CC_SERIES}/86108`,
    description: "<p>What if the greatest threat to your home isn't what's happening around you, but what's happening within you? In a world that has confused and dulled what it means to be a man, many have drifted into passivity or misplaced strength. But Scripture calls us to something far greater: to be watchmen who are awake, anchored in Christ, and willing to lay our lives down. When we step into that calling, everything around us begins to come alive.</p>",
    sermons: [
      { title: "Watchmen on the Wall", date: "April 12, 2026", youtubeId: "YpB93Bgu8m0", speaker: "Pastor Josh Poteet" },
      { title: "Right Where He's Waiting", date: "April 5, 2026", youtubeId: "vJj-hR9GM5g", speaker: "Pastor Josh Poteet" },
    ],
  },
  "buying-back-gomer": {
    title: "Buying Back Gomer",
    subtitle: "A redemption story through the book of Hosea.",
    slug: "buying-back-gomer",
    image: "https://i.ytimg.com/vi/coQieDuSL3o/hqdefault.jpg",
    dateRange: "March 22 - 29, 2026",
    churchCenterUrl: `${CC_SERIES}/84748`,
    description: "<p>A study through the book of Hosea. God's relentless love, faithfulness in the face of betrayal, and the cost of redemption come alive in this powerful Old Testament story.</p>",
    sermons: [
      { title: "Consequences", date: "March 29, 2026", youtubeId: "coQieDuSL3o", speaker: "Pastor Josh Poteet" },
      { title: "Biblegate", date: "March 22, 2026", youtubeId: "QzjZycSt8TY", speaker: "Pastor Josh Poteet" },
    ],
  },
  "for-a-time-such-as-this": {
    title: "For A Time Such As This",
    subtitle: "Finding purpose in the place God has you.",
    slug: "for-a-time-such-as-this",
    image: "https://i.ytimg.com/vi/f1gfshs-Fd4/hqdefault.jpg",
    dateRange: "January 4 - March 9, 2026",
    churchCenterUrl: `${CC_SERIES}/78538`,
    description: "<p>What if you are exactly where you are for a reason? This series explores how God positions us for purpose, even when the circumstances feel uncertain or overwhelming.</p>",
    sermons: [
      { title: "Cross The Road", date: "March 15, 2026", youtubeId: "f1gfshs-Fd4", speaker: "Pastor Josh Poteet" },
      { title: "God of the Turnaround", date: "March 8, 2026", youtubeId: "LOucibW88P8", speaker: "Pastor Josh Poteet" },
      { title: "That's Mine", date: "March 1, 2026", youtubeId: "YOAATPqUWZA", speaker: "Pastor Josh Poteet" },
      { title: "Yellow Car", date: "February 22, 2026", youtubeId: "u7N5Z6GWM7s", speaker: "Pastor Josh Poteet" },
      { title: "Where Dependence Lives", date: "February 15, 2026", youtubeId: "F6H6oMKqPSo", speaker: "Pastor Josh Poteet" },
      { title: "Risk The Palace", date: "February 8, 2026", youtubeId: "r3IWLNwZ8UA", speaker: "Pastor Josh Poteet" },
      { title: "My Goliath, Your Goliath", date: "February 1, 2026", youtubeId: "RNjfZUjuzIQ", speaker: "Pastor Josh Poteet" },
      { title: "For the Joy Ahead", date: "January 25, 2026", youtubeId: "Nz5OX1I9QVE", speaker: "Pastor Josh Poteet" },
      { title: "The Trade", date: "January 18, 2026", youtubeId: "nWXhUJzWveA", speaker: "Pastor Josh Poteet" },
      { title: "Purpose Happens on Tuesday", date: "January 11, 2026", youtubeId: "ONOubBBgoho", speaker: "Pastor Josh Poteet" },
      { title: "Power, Pride and Providence", date: "January 4, 2026", youtubeId: "nxJPR5_c91M", speaker: "Pastor Josh Poteet" },
    ],
  },
  "home-for-christmas": {
    title: "Home For Christmas",
    subtitle: "Coming home to the hope, peace, joy, and love of Christmas.",
    slug: "home-for-christmas",
    image: "https://i.ytimg.com/vi/O1otACXTFRs/hqdefault.jpg",
    dateRange: "December 7 - 21, 2025",
    churchCenterUrl: `${CC_SERIES}/76797`,
    description: "<p>Christmas is about coming home. Not just to a place, but to a Person. This series explores what it means to find your way back to the heart of the season.</p>",
    sermons: [
      { title: "I Wonder", date: "December 28, 2025", youtubeId: "VW_INLGeqvs", speaker: "Pastor Josh Poteet" },
      { title: "Who Wears The Crown", date: "December 21, 2025", youtubeId: "O1otACXTFRs", speaker: "Pastor Josh Poteet" },
      { title: "Do You Want to Get Well?", date: "December 14, 2025", youtubeId: "y_IY9BNR7uA", speaker: "Pastor Josh Poteet" },
    ],
  },
  "on-dry-ground": {
    title: "On Dry Ground",
    subtitle: "When God parts the waters and invites you to walk through.",
    slug: "on-dry-ground",
    image: "https://i.ytimg.com/vi/QJBZwlmzcNc/hqdefault.jpg",
    dateRange: "November 16 - 30, 2025",
    churchCenterUrl: `${CC_SERIES}/75055`,
    description: "<p>God doesn't always remove the obstacles. Sometimes He parts them and asks you to walk through on dry ground. This series explores what it takes to trust God in the middle of the impossible.</p>",
    sermons: [
      { title: "Living a Promised Life", date: "November 30, 2025", youtubeId: "QJBZwlmzcNc", speaker: "Pastor Josh Poteet" },
      { title: "Steward the Moment", date: "November 23, 2025", youtubeId: "B3XhCqZsUHg", speaker: "Pastor Josh Poteet" },
      { title: "The Long Road Home", date: "November 16, 2025", youtubeId: "_f2iHg5hRW4", speaker: "Pastor Josh Poteet" },
    ],
  },
  "truth-in-tension": {
    title: "Truth in Tension",
    subtitle: "Holding onto truth when life pulls you in every direction.",
    slug: "truth-in-tension",
    image: "https://i.ytimg.com/vi/mWy45wtIFqs/hqdefault.jpg",
    dateRange: "October 5 - November 2, 2025",
    churchCenterUrl: `${CC_SERIES}/72437`,
    description: "<p>Some of the most important truths in the Bible seem to pull in opposite directions. Grace and truth. Faith and works. Justice and mercy. This series explores how to hold them together.</p>",
    sermons: [
      { title: "Freedom Has a Seatbelt", date: "November 2, 2025", youtubeId: "mWy45wtIFqs", speaker: "Pastor Josh Poteet" },
    ],
  },
  "all-in": {
    title: "All In",
    subtitle: "What does it look like to go all in with God?",
    slug: "all-in",
    image: "/images/series/placeholder.jpg",
    dateRange: "August 31 - September 28, 2025",
    churchCenterUrl: `${CC_SERIES}/69650`,
    description: "<p>Half-hearted faith leads to a half-lived life. This series challenges us to stop playing it safe and go all in on what God has for us.</p>",
    sermons: [],
  },
  "getting-back-to-eden": {
    title: "Getting Back to Eden",
    subtitle: "Rediscovering what God intended from the beginning.",
    slug: "getting-back-to-eden",
    image: "/images/series/placeholder.jpg",
    dateRange: "August 3 - 24, 2025",
    churchCenterUrl: `${CC_SERIES}/67839`,
    description: "<p>In the beginning, everything was as it should be. This series traces God's plan to restore what was lost and bring us back to the life He always intended.</p>",
    sermons: [],
  },
  "the-movement": {
    title: "The Movement",
    subtitle: "Be part of something bigger than yourself.",
    slug: "the-movement",
    image: "/images/series/placeholder.jpg",
    dateRange: "July 2024 - July 2025",
    churchCenterUrl: `${CC_SERIES}/46358`,
    description: "<p>The early church turned the world upside down. This series explores what it means to be part of the movement that God started and continues today.</p>",
    sermons: [],
  },
  "how-to-fight": {
    title: "How to Fight",
    subtitle: "Spiritual warfare and standing firm in faith.",
    slug: "how-to-fight",
    image: "/images/series/placeholder.jpg",
    dateRange: "April 27 - May 18, 2025",
    churchCenterUrl: `${CC_SERIES}/62199`,
    description: "<p>Every believer faces a battle. This series equips you with the tools and truth you need to fight well and stand firm when the enemy comes.</p>",
    sermons: [],
  },
  "the-broken-gospel": {
    title: "The Broken Gospel",
    subtitle: "The power of the gospel through brokenness.",
    slug: "the-broken-gospel",
    image: "/images/series/placeholder.jpg",
    dateRange: "April 13 - 20, 2025",
    churchCenterUrl: `${CC_SERIES}/61070`,
    description: "<p>The gospel isn't for people who have it all together. It's for the broken, the hurting, and the searching. This Easter series explores the beauty of a gospel that meets us in our mess.</p>",
    sermons: [],
  },
  "follow-me": {
    title: "Follow Me",
    subtitle: "What Jesus really meant when He said follow me.",
    slug: "follow-me",
    image: "/images/series/placeholder.jpg",
    dateRange: "March 2 - April 6, 2025",
    churchCenterUrl: `${CC_SERIES}/58758`,
    description: "<p>When Jesus said 'Follow Me,' it wasn't an invitation to a comfortable life. It was a call to something radical. This series unpacks what it truly means to follow Jesus.</p>",
    sermons: [],
  },
  "crossroads": {
    title: "Crossroads",
    subtitle: "Making decisions that define your future.",
    slug: "crossroads",
    image: "/images/series/placeholder.jpg",
    dateRange: "January 12 - February 25, 2025",
    churchCenterUrl: `${CC_SERIES}/55560`,
    description: "<p>Life is full of crossroads. The decisions we make at those moments shape everything that follows. This series helps you navigate life's biggest choices with wisdom and faith.</p>",
    sermons: [],
  },
  "behold": {
    title: "Behold",
    subtitle: "A Christmas series about seeing Jesus clearly.",
    slug: "behold",
    image: "/images/series/placeholder.jpg",
    dateRange: "December 1 - 22, 2024",
    churchCenterUrl: `${CC_SERIES}/52906`,
    description: "<p>Christmas invites us to stop, look, and behold the wonder of who Jesus is. This series helps us see Him with fresh eyes.</p>",
    sermons: [],
  },
  "living-in-babylon": {
    title: "Living in Babylon",
    subtitle: "Staying faithful in a culture that opposes your faith.",
    slug: "living-in-babylon",
    image: "/images/series/placeholder.jpg",
    dateRange: "October 21 - November 4, 2024",
    churchCenterUrl: `${CC_SERIES}/50997`,
    description: "<p>Daniel and his friends lived as exiles in a hostile culture and thrived. This series explores how we can do the same in our world today.</p>",
    sermons: [],
  },
  "immeasurably-more": {
    title: "Immeasurably More",
    subtitle: "God can do more than you could ever ask or imagine.",
    slug: "immeasurably-more",
    image: "/images/series/placeholder.jpg",
    dateRange: "September 16 - October 6, 2024",
    churchCenterUrl: `${CC_SERIES}/49272`,
    description: "<p>What if God wants to do immeasurably more than you're asking for? This series explores Ephesians 3:20 and what it means to dream bigger with God.</p>",
    sermons: [],
  },
  "the-jonah-mirror": {
    title: "The Jonah Mirror",
    subtitle: "Seeing yourself in the story of Jonah.",
    slug: "the-jonah-mirror",
    image: "/images/series/placeholder.jpg",
    dateRange: "June 3 - July 1, 2024",
    churchCenterUrl: `${CC_SERIES}/44584`,
    description: "<p>The story of Jonah is more than a whale tale. It's a mirror that reflects our own reluctance, rebellion, and the relentless grace of God that pursues us anyway.</p>",
    sermons: [],
  },
  "family-meeting": {
    title: "Family Meeting",
    subtitle: "Honest conversations about life, faith, and family.",
    slug: "family-meeting",
    image: "/images/series/placeholder.jpg",
    dateRange: "April 30 - May 20, 2024",
    churchCenterUrl: `${CC_SERIES}/43095`,
    description: "<p>It's time for a family meeting. This series tackles the real conversations families need to have about faith, priorities, and growing together.</p>",
    sermons: [],
  },
  "why-jesus": {
    title: "Why Jesus?",
    subtitle: "The case for following the most influential person in history.",
    slug: "why-jesus",
    image: "/images/series/placeholder.jpg",
    dateRange: "April 1 - 22, 2024",
    churchCenterUrl: `${CC_SERIES}/41405`,
    description: "<p>In a world of options, why Jesus? This Easter series makes the case for why Jesus matters more than any other leader, teacher, or figure in human history.</p>",
    sermons: [],
  },
  "at-the-movies": {
    title: "At The Movies",
    subtitle: "Discovering biblical truth through the lens of film.",
    slug: "at-the-movies",
    image: "/images/series/placeholder.jpg",
    dateRange: "March 3 - 11, 2024",
    churchCenterUrl: `${CC_SERIES}/40061`,
    description: "<p>We watch scenes from popular movies on Sunday mornings and explore the biblical truths they reveal. Join us for this creative and engaging series!</p>",
    sermons: [],
  },
  "the-ruthless-elimination-of-hurry": {
    title: "The Ruthless Elimination of Hurry",
    subtitle: "Slowing down to live the life God designed for you.",
    slug: "the-ruthless-elimination-of-hurry",
    image: "/images/series/placeholder.jpg",
    dateRange: "January 15 - February 19, 2024",
    churchCenterUrl: `${CC_SERIES}/37398`,
    description: "<p>Hurry is the great enemy of the spiritual life. Inspired by John Mark Comer's book, this series challenges us to ruthlessly eliminate hurry and create space for God.</p>",
    sermons: [],
  },
  "through-the-eyes": {
    title: "Through The Eyes",
    subtitle: "A Christmas series about seeing the world through God's eyes.",
    slug: "through-the-eyes",
    image: "/images/series/placeholder.jpg",
    dateRange: "December 11 - 25, 2023",
    churchCenterUrl: `${CC_SERIES}/35657`,
    description: "<p>Christmas changes the way we see everything. This series invites you to look at the season, and your life, through the eyes of those who witnessed the first Christmas.</p>",
    sermons: [],
  },
  "get-in-the-game": {
    title: "Get in the Game",
    subtitle: "Stop watching from the sidelines and get in the game.",
    slug: "get-in-the-game",
    image: "/images/series/placeholder.jpg",
    dateRange: "September 24 - December 3, 2023",
    churchCenterUrl: `${CC_SERIES}/32249`,
    description: "<p>Too many of us are spectators in our own faith. This series is a call to get off the sidelines, step onto the field, and live the life God created you for.</p>",
    sermons: [],
  },
  "act-like-you-believe": {
    title: "Act Like You Believe",
    subtitle: "When your actions catch up to your faith.",
    slug: "act-like-you-believe",
    image: "/images/series/placeholder.jpg",
    dateRange: "July 9 - September 10, 2023",
    churchCenterUrl: `${CC_SERIES}/28943`,
    description: "<p>It's one thing to say you believe. It's another to live like it. This series from the book of James challenges us to put our faith into action.</p>",
    sermons: [],
  },
  "on-my-heart": {
    title: "On My Heart",
    subtitle: "What's on God's heart for your life?",
    slug: "on-my-heart",
    image: "/images/series/placeholder.jpg",
    dateRange: "April 23 - June 13, 2023",
    churchCenterUrl: `${CC_SERIES}/26200`,
    description: "<p>God has things on His heart for your life, your family, and your future. This series explores what happens when we align our hearts with His.</p>",
    sermons: [],
  },
  "in-god-we-trust": {
    title: "In God We Trust",
    subtitle: "Building a foundation of trust that cannot be shaken.",
    slug: "in-god-we-trust",
    image: "/images/series/placeholder.jpg",
    dateRange: "March 5 - 26, 2023",
    churchCenterUrl: `${CC_SERIES}/24447`,
    description: "<p>Trust is the foundation of every relationship, especially our relationship with God. This series explores what it means to put your full trust in Him.</p>",
    sermons: [],
  },
  "fit-4-god": {
    title: "Fit 4 God",
    subtitle: "Honoring God with your whole self: body, mind, and spirit.",
    slug: "fit-4-god",
    image: "/images/series/placeholder.jpg",
    dateRange: "January 15 - February 27, 2023",
    churchCenterUrl: `${CC_SERIES}/22373`,
    description: "<p>Your body is a temple. This new year series explores what it means to honor God with every part of who you are: physically, mentally, and spiritually.</p>",
    sermons: [],
  },
};

/** All series slugs for static generation */
export const ALL_SERIES_SLUGS = Object.keys(SERMON_SERIES);
