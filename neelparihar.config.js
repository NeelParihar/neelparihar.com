// Upload files in static/ So any file static/file.pdf -> /file.pdf is accessible at root

export default {
  name: "Neel Parihar",
  domain: "neelparihar.com", // add without https:// , used in meta tags and share urls
  image: "/images/avatar.png",
  email: "contact@neelparihar.com",
  googleAnalyticsV4: {
    enabled: true,
    id: "G-QHQT2WMY87",
  },
  plausibleAnalytics: {
    enabled: false,
    domain: "neelparihar.com",
    trackLocalhost: false,
  },
  // enable if you want comments and likes on posts
  // see how it looks on karngyan.com
  firebase: {
    enabled: false,
  },
  social: {
    github: "NeelParihar",
    linkedin: "neel-parihar",
    twitter: "neelpariharr",
    instagram: "neelpariharr",
  },
  buyMeACoffee: {
    enabled: true,
    url: "https://www.buymeacoffee.com/neelparihar",
  },
  projects: {
    enabled: true,
  },
  blog: {
    enabled: false,
  },
  resume: {
    enabled: true,
    pdfUrl: "/NeelParihar2023.pdf", // add files in static folder
  },
  uses: {
    enabled: false,
    meta: [
      { title: "OS", value: "macOS Catalina" },
      { title: "Memory", value: "16 GB 2667 MHz DDR4" },
      { title: "Keyboard", value: "Keychron K2 - Gateron Brown Keys" },
      { title: "Mouse", value: "Logitech Silent Pebble" },
      { title: "Monitor", value: "LG QHD (2560 x 1440) 27 Inch IPS Display" },
      {
        title: "Laptop • Processor • Graphics",
        value:
          "MacBook Pro (16-inch, 2019) • 2.6 GHz 6-Core Intel Core i7 • AMD Radeon Pro 5300M 4 GB + Intel UHD Graphics 630 1536 MB",
      },
    ],
  },
  workedAt: {
    // add logos in static and at max add 3/4
    enabled: true,
    meta: [
      {
        name: "Rivi AI",
        src: "/images/rivi-logo.png",
        url: "https://rivi.co/",
      },
      {
        name: "Decathlon Play",
        src: "/images/decathlon-new.png",
        url: "https://play.decathlon.in/",
      },
      {
        name: "TerminusDB",
        src: "/images/terminusdb.png",
        url: "https://terminusdb.com/",
      },
      {
        name: "Classplus",
        src: "/images/classplus.png",
        url: "https://classplusapp.com/",
      },
    ],
  },
  recommendations: {
    enabled: true,
    meta: [
      {
        name: "Harikrupa Padmanabhan",
        designation: "Delivery Head, Decathlon",
        image: "/images/harikrupa.png",
        linkedin: "https://www.linkedin.com/in/harikrupa/",
        content:
          "Neel is an extraordinarily talented, diligent, and foresighted individual. He is gifted at building products from paper to code and has a knack for finding efficient solutions to complex problems. One remarkable instance that highlights his problem-solving abilities was during a critical Prod troubleshooting session. His ability to think ahead, troubleshoot effectively, and deliver results with such dedication makes him an invaluable asset to any team.",
      },
      {
        name: "Gavin Mendel-Gleason",
        designation: "Founder/CTO, TerminusDB",
        image: "/images/gavin.png",
        linkedin: "https://www.linkedin.com/in/gavinmendelgleason/",
        content:
          "Neel worked full-time with TerminusDB for around 1 year. He is a very strong full-stack engineer who can create pixel-perfect frontends while being able to work on complex nodejs projects such as creating database sdk's. He is a quick learner, a great team player, and has a very strong work ethic. You can rely on him that things will be done with utmost quality.",
      },
    ],
  },
  loadingIndicator: {
    name: "pulse",
    // https://tobiasahlin.com/spinkit/
    // circle
    // cube-grid
    // fading-circle
    // folding-cube
    // chasing-dots
    // nuxt
    // pulse
    // rectangle-bounce
    // rotating-plane
    // three-bounce
    // wandering-cubes
  },
  laguageSwitcher: {
    enabled: true,
  },
  strings: {
    en_US: {
      download: "download",
      nav: {
        home: "home",
        blog: "blog",
        projects: "projects",
        uses: "uses",
        resume: "résumé",
        buyMeACoffee: "buy me a coffee",
        signIn: "sign in",
        signOut: "sign out",
      },
      hero: {
        iBlogTech: "i blog tech",
        haveALook: "have a look",
        friendlyNeighborhood: "your friendly neighborhood developer",
        description:
          "I am a software engineer with a passion for solving problems and building innovative solutions. I have a strong background in web development and a particular interest in front-end technologies.",
      },
      githubCalendar: {
        header: "contributions",
        subtext: "github calendar heatmap",
      },
      blog: {
        header: "blog",
        subtext:
          "i try to write once in a while. let me know your thoughts in comments or mail@karngyan.com",
      },
      recentBlog: {
        header: "recent blogs",
        subtext: "it takes a lot of time to write man",
      },
      uses: {
        header: "uses",
        subtext:
          "a quick summary of what I use on a daily basis to code and some codestats.net flex",
      },
      projects: {
        header: "projects",
        subtext:
          "this page lists some of my personal and work projects. every project has some story, click on the title to read",
      },
      recommendations: {
        header: "recommendations",
        subtext: "what do my mentors say",
      },
    },
  },
};
