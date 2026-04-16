import React, { useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Bell,
  CalendarHeart,
  Camera,
  Check,
  Clock3,
  ChevronRight,
  Crown,
  Download,
  Eye,
  FileText,
  Heart,
  Headphones,
  KeyRound,
  Home,
  Lock,
  MapPin,
  Menu,
  MessageCircle,
  Pencil,
  Plus,
  Send,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Share2,
  Settings,
  Upload,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { brandImages, conversations, demoCredentials, premiumImages, profiles, quickFilters } from "./mockData";
import { downloadKundli, saveBlob, signInWithEmail } from "./services/matrimonyApi";

const FILTER_PRESETS = ["Telugu speaking", "Same community", "With horoscope", "Photo verified"];

const FILTER_OPTION_GROUPS = [
  { label: "Zodiac", options: ["Any", "Mesha", "Vrushabha", "Mithuna"] },
  { label: "Star", options: ["Any", "Rohini", "Anuradha", "Revati"] },
  { label: "Education", options: ["Any", "Graduate", "Engineer", "Doctor"] },
  { label: "City", options: ["Any", "Hyderabad", "Vijayawada", "Visakhapatnam"] },
];

const RANGE_FILTERS = [
  { key: "age", label: "Age", minLimit: 21, maxLimit: 36, unit: "yrs" },
  { key: "weight", label: "Weight", minLimit: 40, maxLimit: 95, unit: "kg" },
];

const INITIAL_FILTERS = {
  presets: ["Telugu speaking", "With horoscope"],
  Zodiac: ["Any"],
  Star: ["Any"],
  Education: ["Graduate"],
  City: ["Hyderabad"],
};

const INITIAL_RANGES = {
  age: [25, 31],
  weight: [45, 72],
};

const INITIAL_PROFILE_STATS = {
  viewedYou: 128,
  profilesChecked: 42,
  kundliDownloads: 0,
  profileShares: 6,
};

const CLIENT_FLOW_STEPS = [
  {
    title: "01. Brand splash",
    body: "Quick Sonthangal introduction with Telugu match and Kundli promise.",
  },
  {
    title: "02. Profile start",
    body: "Simple matrimony registration for family-created profiles.",
  },
  {
    title: "03. Guided setup",
    body: "Basic, horoscope, professional, and confirmation steps.",
  },
  {
    title: "04. Mobile verification",
    body: "OTP-style phone check to keep every registration traceable.",
  },
  {
    title: "05. Photo verification",
    body: "Photo upload and profile image review before stronger visibility.",
  },
  {
    title: "06. Profile verification",
    body: "Family, education, profession, and core details marked for review.",
  },
  {
    title: "07. Horoscope verification",
    body: "Birth details and Kundli readiness checked for astrology matching.",
  },
  {
    title: "08. Match discovery",
    body: "Home feed with viewed profiles, matched profiles, and Kundli compatibility.",
  },
  {
    title: "09. Search & filters",
    body: "Age, city, education, zodiac, star, and photo-ready filtering.",
  },
  {
    title: "10. Profile detail",
    body: "Full profile, contact intent, Kundli download, and premium gate.",
  },
  {
    title: "11. Premium path",
    body: "Upgrade flow for Kundli reports, priority reach, and privacy controls.",
  },
];

const CLIENT_FEATURES = [
  "iPhone-style app preview",
  "Splash, registration, and guided setup",
  "Telugu match feed with real profile detail",
  "Search, filters, notification, and sidebar flow",
  "Kundli PDF download with premium lock",
  "PWA-ready installable mobile experience",
];

const VERIFICATION_STEPS = [
  "Mobile number OTP check",
  "Photo upload and profile image review",
  "Family, education, and profession review",
  "Birth details and horoscope readiness",
  "Premium member access control for Kundli",
];

const REFERENCE_POINTS = [
  "Nithra Matrimony inspired the mobile-first match feed, family tone, and horoscope/Kundli emphasis.",
  "Jeevansathi informed the trusted registration flow, search filters, premium prompts, and verified-profile cues.",
  "Sonthangal keeps the final direction custom with Telugu-first content, CuboidSoft branding, and burgundy/gold styling.",
];

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [likedIds, setLikedIds] = useState([1]);

  function toggleLike(profileId) {
    setLikedIds((current) =>
      current.includes(profileId)
        ? current.filter((id) => id !== profileId)
        : [...current, profileId],
    );
  }

  return (
    <main className="app-canvas">
      <section className="desktop-context" aria-label="Sonthangal overview">
        <div className="presentation-hero">
          <div className="brand-mark">
            <BrandLogo compact />
          </div>
          <div>
            <p className="eyebrow">Made by CuboidSoft</p>
            <h1>Sonthangal Project</h1>
            <p className="desktop-copy">
              A Telugu matrimony mobile experience designed and built by CuboidSoft
              for trusted family-first matchmaking.
            </p>
          </div>
        </div>

        <div className="proof-strip" aria-label="trust highlights">
          <span>
            <ShieldCheck size={17} />
            Verified
          </span>
          <span>
            <Lock size={17} />
            Private
          </span>
          <span>
            <Crown size={17} />
            Premium
          </span>
        </div>

        <ClientFlowOverview />
      </section>

      <section className="phone-stage" aria-label="Mobile application preview">
        <div className="phone-frame">
          {showSplash ? (
            <SplashIntro onFinish={() => setShowSplash(false)} />
          ) : isSignedIn ? (
            showOnboarding ? (
              <Onboarding onComplete={() => setShowOnboarding(false)} />
            ) : (
              <MobileShell
                activeTab={activeTab}
                likedIds={likedIds}
                onLike={toggleLike}
                onTabChange={setActiveTab}
              />
            )
          ) : (
            <Login onSuccess={() => setIsSignedIn(true)} />
          )}
        </div>
      </section>
    </main>
  );
}

function ClientFlowOverview() {
  return (
    <section className="client-flow" aria-label="Client presentation flow">
      <div className="client-overview-grid">
        <div className="client-panel">
          <p>Features delivered</p>
          <h2>What clients can review on this screen</h2>
          <div className="feature-list">
            {CLIENT_FEATURES.map((feature) => (
              <span key={feature}>
                <Check size={15} />
                {feature}
              </span>
            ))}
          </div>
        </div>

        <div className="client-panel client-verification-panel">
          <p>Verification layers</p>
          <h2>Trust checks planned in the flow</h2>
          <div className="verification-list">
            {VERIFICATION_STEPS.map((step) => (
              <span key={step}>
                <ShieldCheck size={15} />
                {step}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="client-flow-header">
        <p>Design flow</p>
        <h2>How the Sonthangal mobile experience is structured</h2>
      </div>

      <div className="flow-timeline">
        {CLIENT_FLOW_STEPS.map((step) => (
          <article key={step.title}>
            <strong>{step.title}</strong>
            <span>{step.body}</span>
          </article>
        ))}
      </div>

      <div className="reference-panel">
        <p>Reference direction</p>
        {REFERENCE_POINTS.map((point) => (
          <span key={point}>{point}</span>
        ))}
      </div>
    </section>
  );
}

function BrandLogo({ className = "", compact = false }) {
  return (
    <img
      alt="Sonthangal"
      className={`brand-logo ${compact ? "compact" : ""} ${className}`}
      src={brandImages.logo}
    />
  );
}

function SplashIntro({ onFinish }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    {
      kicker: "Sonthangal",
      title: "Telugu matches shaped for family-first search.",
      body: "A calm mobile space for serious profiles, verification, and meaningful first steps.",
      icon: <Crown size={34} />,
      tone: "brand",
      backgroundImage: brandImages.launch,
    },
    {
      kicker: "Telugu special",
      title: "Find Telugu matches with community-first filters.",
      body: "Browse by city, profession, family preference, horoscope status, and active profiles.",
      icon: <Users size={34} />,
      tone: "telugu",
      backgroundImage: brandImages.profileThree,
    },
    {
      kicker: "Kundli ready",
      title: "Download Kundli details when a match feels right.",
      body: "Keep horoscope and profile details organized for family conversations.",
      icon: <Download size={34} />,
      tone: "kundli",
      backgroundImage: brandImages.groomOne,
    },
  ];
  const slide = slides[activeSlide];
  const isLastSlide = activeSlide === slides.length - 1;

  function goNext() {
    if (isLastSlide) {
      onFinish();
      return;
    }

    setActiveSlide((current) => current + 1);
  }

  return (
    <div className={`screen splash-screen ${slide.tone}`}>
      <div className="splash-background" aria-hidden="true">
        <img alt="" src={slide.backgroundImage} />
      </div>
      <button className="skip-button" onClick={onFinish} type="button">
        Skip
      </button>
      <div className="splash-orbit" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="splash-icon">
        {slide.tone === "brand" ? <BrandLogo /> : slide.icon}
      </div>
      <div className="splash-copy">
        <p>{slide.kicker}</p>
        <h2>{slide.title}</h2>
        <span>{slide.body}</span>
      </div>
      <div className="splash-footer">
        <div className="slide-dots" aria-label="Splash progress">
          {slides.map((item, index) => (
            <button
              aria-label={`Show ${item.kicker}`}
              className={activeSlide === index ? "active" : ""}
              key={item.kicker}
              onClick={() => setActiveSlide(index)}
              type="button"
            />
          ))}
        </div>
        <button className="primary-action" onClick={goNext} type="button">
          {isLastSlide ? "Start" : "Next"}
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

function Login({ onSuccess }) {
  const [profileFor, setProfileFor] = useState("");
  const [showProfileForOptions, setShowProfileForOptions] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("Male");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!profileFor || !fullName || !phoneNumber || !acceptedTerms) {
        throw new Error("Complete the required registration fields.");
      }

      await signInWithEmail({
        email: demoCredentials.email,
        password: demoCredentials.password,
      });
      onSuccess();
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="screen registration-entry-screen">
      <form className="registration-card" onSubmit={handleSubmit}>
        <div className="registration-brand">
          <BrandLogo />
        </div>

        <div className="registration-title">
          <h2>Create a Matrimony Profile</h2>
          <p>Find the one that feels right</p>
        </div>

        <div className="registration-fields">
          <div className="dropdown-field">
            <button
              className={profileFor ? "select-button selected" : "select-button"}
              onClick={() => setShowProfileForOptions((current) => !current)}
              type="button"
            >
              {profileFor || "Who is creating ?"}
              <ChevronRight size={18} />
            </button>
            {showProfileForOptions ? (
              <div className="dropdown-menu">
                {["Sibling", "Parents", "Myself", "Relative", "Friend"].map((option) => (
                  <button
                    className={profileFor === option ? "active" : ""}
                    key={option}
                    onClick={() => {
                      setProfileFor(option);
                      setShowProfileForOptions(false);
                    }}
                    type="button"
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <label className="simple-field" aria-label="Full name">
            <input
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Enter your full name"
              value={fullName}
            />
          </label>

          <div className="gender-line">
            <span>Gender</span>
            <div className="gender-options">
              {["Male", "Female"].map((option) => (
                <button
                  className={gender === option ? "active" : ""}
                  key={option}
                  onClick={() => setGender(option)}
                  type="button"
                >
                  <i />
                  {option}
                </button>
              ))}
            </div>
          </div>

          <label className="phone-field" aria-label="Mobile number">
            <span>+91</span>
            <input
              inputMode="tel"
              onChange={(event) => setPhoneNumber(event.target.value)}
              placeholder="Enter your mobile number"
              value={phoneNumber}
            />
          </label>

          <label className="terms-line">
            <input
              checked={acceptedTerms}
              onChange={(event) => setAcceptedTerms(event.target.checked)}
              type="checkbox"
            />
            <span>
              Accept <strong>Terms & Conditions</strong>
            </span>
          </label>
        </div>

        {error ? <p className="form-error">{error}</p> : null}

        <button className="primary-action" disabled={isLoading} type="submit">
          {isLoading ? "Creating..." : "Register & Complete Your Profile"}
          <ChevronRight size={18} />
        </button>
      </form>
    </div>
  );
}

function Onboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ["Basic", "Horoscope", "Professional", "Confirm"];
  const isLastStep = currentStep === steps.length - 1;

  function goNext() {
    if (isLastStep) {
      onComplete();
      return;
    }

    setCurrentStep((step) => step + 1);
  }

  return (
    <div className="screen onboarding-screen">
      <TopBar title="Complete Profile" />
      <div className="content-scroll setup-content">
        <SetupVisualHeader currentStep={currentStep} />

        <div className="setup-stepper">
          {steps.map((step, index) => (
            <button
              className={index === currentStep ? "active" : index < currentStep ? "done" : ""}
              key={step}
              onClick={() => setCurrentStep(index)}
              type="button"
            >
              <span>{step}</span>
              <i />
            </button>
          ))}
        </div>

        <SetupStep step={currentStep} />
      </div>

      <div className="setup-footer">
        <button className="primary-action setup-next" onClick={goNext} type="button">
          {isLastStep ? "Finish Profile" : "Next"}
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

function SetupVisualHeader({ currentStep }) {
  const setupNotes = [
    "Start with family and basic profile details.",
    "Add horoscope details for Kundli-ready matching.",
    "Share education and work details for better matches.",
    "Review your profile before publishing.",
  ];

  return (
    <section className="setup-visual-header">
      <div className="setup-people">
        <img alt="Telugu bride profile" src={profiles[0].image} />
        <span>
          <Heart size={16} />
        </span>
        <img alt="Telugu groom profile" src={profiles[3].image} />
      </div>
      <div>
        <p>Profile setup</p>
        <h2>Build a complete Telugu matrimony profile</h2>
        <span>{setupNotes[currentStep]}</span>
      </div>
    </section>
  );
}

function SetupStep({ step }) {
  if (step === 1) {
    return (
      <section className="setup-form">
        <SetupField required label="Star" type="select" value="Please Select Star" />
        <SetupField required label="Zodiac" type="select" value="Please Select Zodiac" />
        <SetupField required label="Birth Time" value="Enter birth time" />
        <SetupField required label="Birth Place" value="Enter birth place" />
        <SetupField label="Kundli Status" type="select" value="Upload later" />
      </section>
    );
  }

  if (step === 2) {
    return (
      <section className="setup-form">
        <SetupField required label="Education" type="select" value="Please Select Education" />
        <SetupField required label="Occupation" value="Enter occupation" />
        <SetupField label="Annual Income" type="select" value="Please Select Income" />
        <SetupField label="Work Location" value="Enter work location" />
      </section>
    );
  }

  if (step === 3) {
    return (
      <section className="confirm-panel">
        <ShieldCheck size={30} />
        <h2>Review and publish</h2>
        <p>
          Your basic, horoscope, and professional details are ready. You can
          edit them anytime from your profile.
        </p>
      </section>
    );
  }

  return (
    <section className="setup-form">
      <SetupField required label="Marital Status" type="select" value="Never married" />
      <SetupField required label="Mother Tongue" type="select" value="Telugu" />
      <SetupField required label="Religion" type="select" value="Hindu" />
      <SetupField required label="Caste" type="select" value="Please Select Caste" />
      <SetupField required label="Division" type="select" value="Please Select Division (Nadu)" />
      <SetupField label="Subcaste" value="Enter Subcast" />
      <SetupField label="Height (CM)" value="Enter your height in centimeters" />
      <SetupField label="Email Address" value="Enter Email address" />
      <SetupField required label="Password" type="password" value="Enter New Password" />
      <SetupField required label="Confirm Password" value="Re-Enter password to confirm" />
    </section>
  );
}

function SetupField({ label, required = false, type = "text", value }) {
  return (
    <label className="setup-field">
      <span>
        {required ? <b>*</b> : null}
        {label}:
      </span>
      <div>
        <input readOnly type={type === "password" ? "password" : "text"} value={value} />
        {type === "select" ? <ChevronRight size={16} /> : null}
      </div>
    </label>
  );
}

function PreferenceGroup({ label, onChange, options, value }) {
  return (
    <section className="preference-group">
      <h3>{label}</h3>
      <div className="chip-grid">
        {options.map((option) => (
          <button
            className={value === option ? "chip selected" : "chip"}
            key={option}
            onClick={() => onChange(option)}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  );
}

function MobileShell({ activeTab, likedIds, onLike, onTabChange }) {
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isPaidMember, setIsPaidMember] = useState(false);
  const [profileStats, setProfileStats] = useState(INITIAL_PROFILE_STATS);
  const selectedProfile = profiles.find((profile) => profile.id === selectedProfileId);
  const openPremium = () => {
    setShowUpgradeModal(false);
    setSelectedProfileId(null);
    onTabChange("premium");
  };

  const recordKundliDownload = () => {
    setProfileStats((stats) => ({
      ...stats,
      kundliDownloads: stats.kundliDownloads + 1,
    }));
  };

  if (showFilter) {
    return <FilterScreen onBack={() => setShowFilter(false)} />;
  }

  if (showSearch) {
    return <SearchScreen onBack={() => setShowSearch(false)} onOpenProfile={setSelectedProfileId} />;
  }

  if (showNotifications) {
    return <NotificationScreen onBack={() => setShowNotifications(false)} onOpenProfile={setSelectedProfileId} />;
  }

  if (selectedProfile) {
    return (
      <div className="screen-layer">
        <ProfileDetailView
          isPaidMember={isPaidMember}
          liked={likedIds.includes(selectedProfile.id)}
          onBack={() => setSelectedProfileId(null)}
          onKundliDownloaded={recordKundliDownload}
          onLike={() => onLike(selectedProfile.id)}
          onRequestUpgrade={() => setShowUpgradeModal(true)}
          profile={selectedProfile}
        />
        {showUpgradeModal ? <UpgradePlanModal onClose={() => setShowUpgradeModal(false)} onUpgrade={openPremium} /> : null}
      </div>
    );
  }

  return (
    <div className="screen app-screen">
      <AppHeader
        onOpenNotifications={() => setShowNotifications(true)}
        onOpenSearch={() => setShowSearch(true)}
        onOpenSidebar={() => setShowSidebar(true)}
      />
      {showSidebar ? <SidebarMenu onClose={() => setShowSidebar(false)} /> : null}
      {activeTab === "home" ? (
        <HomeView
          likedIds={likedIds}
          onLike={onLike}
          onOpenFilter={() => setShowFilter(true)}
          onOpenPremium={openPremium}
          onOpenProfile={setSelectedProfileId}
        />
      ) : null}
      {activeTab === "matches" ? (
        <MatchesView likedIds={likedIds} onLike={onLike} onOpenProfile={setSelectedProfileId} />
      ) : null}
      {activeTab === "messages" ? <MessagesView /> : null}
      {activeTab === "premium" ? <PremiumView isPaidMember={isPaidMember} onActivatePaid={() => setIsPaidMember(true)} /> : null}
      {activeTab === "profile" ? (
        <ProfileView
          isPaidMember={isPaidMember}
          onMarkPaid={() => setIsPaidMember(true)}
          onOpenPremium={openPremium}
          profileStats={profileStats}
        />
      ) : null}
      {showUpgradeModal ? <UpgradePlanModal onClose={() => setShowUpgradeModal(false)} onUpgrade={openPremium} /> : null}
      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}

function AppHeader({ onOpenNotifications, onOpenSearch, onOpenSidebar }) {
  return (
    <header className="app-header">
      <div className="app-title-lockup">
        <button aria-label="Menu" className="menu-mark" onClick={onOpenSidebar} type="button">
          <Menu size={22} />
        </button>
        <BrandLogo compact />
      </div>
      <div className="header-actions">
        <button aria-label="Notifications" className="icon-button active" onClick={onOpenNotifications} type="button">
          <Bell size={19} />
        </button>
        <button aria-label="Search" className="icon-button" onClick={onOpenSearch} type="button">
          <Search size={20} />
        </button>
      </div>
    </header>
  );
}

function SidebarMenu({ onClose }) {
  const [openGroup, setOpenGroup] = useState("Matches");
  const groups = {
    Matches: ["My Matches", "Viewed My Profile", "Astrology Matches", "Shortlisted"],
    Account: ["Edit Profile", "Photo Settings", "Privacy Controls", "Kundli Details"],
    Support: ["Help Center", "Contact CuboidSoft", "Report Profile"],
  };

  return (
    <div className="sidebar-layer">
      <button aria-label="Close menu" className="sidebar-scrim" onClick={onClose} type="button" />
      <aside className="sidebar-panel">
        <div className="sidebar-brand">
          <BrandLogo compact />
          <div>
            <strong>Sonthangal</strong>
          </div>
        </div>
        {Object.entries(groups).map(([group, items]) => (
          <section className="sidebar-group" key={group}>
            <button onClick={() => setOpenGroup(openGroup === group ? "" : group)} type="button">
              {group}
              <ChevronRight size={17} />
            </button>
            {openGroup === group ? (
              <div>
                {items.map((item) => (
                  <button key={item} onClick={onClose} type="button">
                    {item}
                  </button>
                ))}
              </div>
            ) : null}
          </section>
        ))}
      </aside>
    </div>
  );
}

function TopBar({ title }) {
  return (
    <header className="top-bar">
      <BrandLogo compact />
      <h2>{title}</h2>
    </header>
  );
}

function HomeView({ likedIds, onLike, onOpenFilter, onOpenPremium, onOpenProfile }) {
  const matchedProfile = profiles[0];

  return (
    <>
      <div className="content-scroll home-dashboard">
      <div className="home-tabs" aria-label="Match shortcuts">
        {["Quick Access", "My Matches", "Recently Viewed", "Grooms"].map((tab, index) => (
          <button className={index === 1 ? "active" : ""} key={tab} type="button">
            {tab}
          </button>
        ))}
      </div>

      <PremiumBanner onOpenPremium={onOpenPremium} variant="home" />

      <section className="viewed-section">
        <h3>People Viewed your Profile (08)</h3>
        <div className="viewed-strip">
          {profiles.map((profile) => (
            <button className="viewed-card" key={profile.id} onClick={() => onOpenProfile(profile.id)} type="button">
              <img alt={`${profile.name} profile`} src={profile.image} />
              <span>
                {profile.age} yrs, {profile.height}, Telugu
                <br />
                {profile.city}
              </span>
              <strong>{profile.name.split(" ")[0]}</strong>
            </button>
          ))}
        </div>
      </section>

      <section className="matched-section">
        <h3>Matched Profile</h3>
        <article className="featured-match">
          <button className="featured-image" onClick={() => onOpenProfile(matchedProfile.id)} type="button">
            <img alt={`${matchedProfile.name} profile`} src={matchedProfile.image} />
            <span>
              <Crown size={15} />
            </span>
          </button>
          <div>
            <h4>
              {matchedProfile.name}
              <BadgeCheck size={17} />
            </h4>
            <p>
              {matchedProfile.age} yrs | {matchedProfile.height}, {matchedProfile.maritalStatus},{" "}
              {matchedProfile.city}, {matchedProfile.education}, {matchedProfile.job}.
            </p>
            <button onClick={() => onOpenProfile(matchedProfile.id)} type="button">
              View Full Details
              <Sparkles size={14} />
            </button>
          </div>
        </article>
      </section>

      <section className="star-section">
        <div className="star-section-heading">
          <div>
            <p>Kundli compatible</p>
            <h3>Star matched profiles</h3>
          </div>
          <span>{profiles.length - 1}</span>
        </div>
        <div className="star-grid">
          {profiles.slice(1).map((profile) => (
            <button className="star-card" key={profile.id} onClick={() => onOpenProfile(profile.id)} type="button">
              <div className="star-card-photo">
                <img alt="" src={profile.image} />
                <span>
                  <Star size={13} />
                  {profile.kundli.score}
                </span>
              </div>
              <div className="star-card-copy">
                <h4>{profile.name}</h4>
                <p>{profile.age} yrs - {profile.job}</p>
                <strong>{profile.religion} - {profile.community}</strong>
                <small>{profile.city} - {profile.star}, {profile.zodiac}</small>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="home-insights">
        <h3>Today on Sonthangal</h3>
        <div>
          <article>
            <strong>18</strong>
            <span>new Telugu profiles</span>
          </article>
          <article>
            <strong>07</strong>
            <span>families online now</span>
          </article>
          <article>
            <strong>12</strong>
            <span>Kundli-ready matches</span>
          </article>
        </div>
      </section>

      <section className="quick-actions-panel">
        <h3>Complete faster</h3>
        <button type="button">
          <Camera size={18} />
          Add profile photo
          <ChevronRight size={16} />
        </button>
        <button type="button">
          <FileText size={18} />
          Upload Kundli details
          <ChevronRight size={16} />
        </button>
      </section>

      </div>

      <button aria-label="Open filters" className="floating-filter" onClick={onOpenFilter} type="button">
        <SlidersHorizontal size={28} />
      </button>
    </>
  );
}

function PremiumBanner({ onOpenPremium, variant = "default" }) {
  return (
    <section className={`premium-mini-banner ${variant}`}>
      <span className="premium-banner-icon">
        <Crown size={20} />
      </span>
      <div>
        <p>Premium</p>
        <h3>Kundli + priority matches</h3>
      </div>
      <button onClick={onOpenPremium} type="button">
        Upgrade
        <Sparkles size={14} />
      </button>
    </section>
  );
}

function MatchesView({ likedIds, onLike, onOpenProfile }) {
  const shortlisted = profiles.filter((profile) => likedIds.includes(profile.id));
  const visibleProfiles = shortlisted.length ? shortlisted : profiles;

  return (
    <div className="content-scroll matches-view">
      <section className="status-band">
        <div>
          <p>Today</p>
          <h2>{visibleProfiles.length} priority matches</h2>
        </div>
        <CalendarHeart size={34} />
      </section>

      <div className="segment-control">
        <button className="active" type="button">
          Shortlisted
        </button>
        <button type="button">Viewed you</button>
        <button type="button">Premium</button>
      </div>

      <div className="match-stack">
        {visibleProfiles.map((profile) => (
          <MatchCard
            key={profile.id}
            liked={likedIds.includes(profile.id)}
            onLike={() => onLike(profile.id)}
            onOpenProfile={() => onOpenProfile(profile.id)}
            profile={profile}
          />
        ))}
      </div>
    </div>
  );
}

function FilterScreen({ onBack }) {
  const [mode, setMode] = useState("Filter");
  const [query, setQuery] = useState("");
  const [ranges, setRanges] = useState(INITIAL_RANGES);
  const [selectedFilters, setSelectedFilters] = useState(INITIAL_FILTERS);
  const mockMatchCount = profiles.length * 24 + selectedFilters.presets.length * 5;

  const updateRange = (key, index, nextValue) => {
    setRanges((current) => {
      const nextRange = [...current[key]];
      nextRange[index] = Number(nextValue);

      if (index === 0 && nextRange[0] > nextRange[1] - 1) {
        nextRange[0] = nextRange[1] - 1;
      }

      if (index === 1 && nextRange[1] < nextRange[0] + 1) {
        nextRange[1] = nextRange[0] + 1;
      }

      return { ...current, [key]: nextRange };
    });
  };

  const toggleFilter = (groupLabel, option) => {
    setSelectedFilters((current) => {
      const activeGroup = current[groupLabel] ?? [];
      const isSelected = activeGroup.includes(option);
      let nextGroup;

      if (option === "Any") {
        nextGroup = ["Any"];
      } else if (isSelected) {
        nextGroup = activeGroup.filter((item) => item !== option);
      } else {
        nextGroup = [...activeGroup.filter((item) => item !== "Any"), option];
      }

      if (groupLabel === "presets") {
        return { ...current, [groupLabel]: nextGroup };
      }

      return { ...current, [groupLabel]: nextGroup.length ? nextGroup : ["Any"] };
    });
  };

  const resetFilters = () => {
    setQuery("");
    setRanges(INITIAL_RANGES);
    setSelectedFilters(INITIAL_FILTERS);
    setMode("Filter");
  };

  return (
    <div className="screen filter-screen">
      <header className="filter-header enhanced-filter-header">
        <button aria-label="Back" className="icon-button" onClick={onBack} type="button">
          <ArrowLeft size={20} />
        </button>
        <div>
          <p>Preference filters</p>
          <h2>Search Your Match</h2>
        </div>
        <button aria-label="Reset filters" className="icon-button" onClick={resetFilters} type="button">
          <X size={18} />
        </button>
      </header>

      <div className="filter-scroll enhanced-filter-scroll">
        <section className="filter-summary">
          <span>
            <SlidersHorizontal size={16} />
            {mockMatchCount} mock matches
          </span>
          <strong>Family-first Telugu search</strong>
        </section>

        <div className="filter-switch">
          {["Search", "Filter"].map((item) => (
            <button className={mode === item ? "active" : ""} key={item} onClick={() => setMode(item)} type="button">
              {item}
            </button>
          ))}
        </div>

        {mode === "Search" && (
          <section className="filter-search-card">
            <label htmlFor="filter-search">Search by name, city or profession</label>
            <div>
              <Search size={18} />
              <input
                id="filter-search"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Example: Hyderabad, Doctor"
                type="search"
                value={query}
              />
            </div>
          </section>
        )}

        <section className="filter-presets">
          <div className="filter-section-title">
            <h3>Quick preference</h3>
            <span>{selectedFilters.presets.length} active</span>
          </div>
          <div className="filter-chip-grid">
            {FILTER_PRESETS.map((option) => (
              <button
                className={selectedFilters.presets.includes(option) ? "selected" : ""}
                key={option}
                onClick={() => toggleFilter("presets", option)}
                type="button"
              >
                {selectedFilters.presets.includes(option) ? <Check size={14} /> : <Plus size={14} />}
                {option}
              </button>
            ))}
          </div>
        </section>

        {RANGE_FILTERS.map((rangeFilter) => (
          <RangeControl
            key={rangeFilter.key}
            label={rangeFilter.label}
            maxLimit={rangeFilter.maxLimit}
            minLimit={rangeFilter.minLimit}
            onChange={(index, nextValue) => updateRange(rangeFilter.key, index, nextValue)}
            unit={rangeFilter.unit}
            value={ranges[rangeFilter.key]}
          />
        ))}

        <section className="filter-block">
          <div className="filter-section-title">
            <h3>Height</h3>
            <span>Preferred</span>
          </div>
          <div className="height-grid">
            <FilterSelect label="From" value="4ft 10in / 147 cm" />
            <FilterSelect label="To" value="5ft 8in / 173 cm" />
          </div>
        </section>

        {FILTER_OPTION_GROUPS.map((group) => (
          <FilterChipGroup
            key={group.label}
            label={group.label}
            onToggle={(option) => toggleFilter(group.label, option)}
            options={group.options}
            selected={selectedFilters[group.label] ?? ["Any"]}
          />
        ))}
      </div>

      <div className="filter-footer enhanced-filter-footer">
        <button className="filter-reset-action" onClick={resetFilters} type="button">
          Reset
        </button>
        <button className="primary-action" onClick={onBack} type="button">
          Show {mockMatchCount} matches
        </button>
      </div>
    </div>
  );
}

function RangeControl({ label, value, minLimit, maxLimit, unit, onChange }) {
  return (
    <section className="range-block">
      <div className="filter-section-title">
        <h3>{label}</h3>
        <span>
          {value[0]} - {value[1]} {unit}
        </span>
      </div>
      <div className="range-box">
        <div className="range-slider-row">
          <span>Minimum</span>
          <input
            aria-label={`${label} minimum`}
            max={maxLimit - 1}
            min={minLimit}
            onChange={(event) => onChange(0, event.target.value)}
            type="range"
            value={value[0]}
          />
          <strong>
            {value[0]} {unit}
          </strong>
        </div>
        <div className="range-slider-row">
          <span>Maximum</span>
          <input
            aria-label={`${label} maximum`}
            max={maxLimit}
            min={minLimit + 1}
            onChange={(event) => onChange(1, event.target.value)}
            type="range"
            value={value[1]}
          />
          <strong>
            {value[1]} {unit}
          </strong>
        </div>
      </div>
    </section>
  );
}

function FilterSelect({ label, value }) {
  return (
    <div className="filter-select">
      <span>{label} :</span>
      <button type="button">
        {value}
        <ChevronRight size={15} />
      </button>
    </div>
  );
}

function FilterChipGroup({ label, options, selected, onToggle }) {
  return (
    <section className="filter-block chip-filter-block">
      <div className="filter-section-title">
        <h3>{label}</h3>
        <span>{selected.join(", ")}</span>
      </div>
      <div className="filter-chip-grid">
        {options.map((option) => {
          const isSelected = selected.includes(option);

          return (
            <button className={isSelected ? "selected" : ""} key={option} onClick={() => onToggle(option)} type="button">
              {isSelected ? <Check size={14} /> : <Plus size={14} />}
              {option}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function SearchScreen({ onBack, onOpenProfile }) {
  const [query, setQuery] = useState("");
  const visibleProfiles = profiles.filter((profile) =>
    `${profile.name} ${profile.city} ${profile.job} ${profile.star}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return (
    <div className="screen search-screen">
      <header className="app-header search-app-header">
        <div className="app-title-lockup">
          <button aria-label="Back" className="menu-mark" onClick={onBack} type="button">
            <ArrowLeft size={21} />
          </button>
          <div>
            <p>Find profiles</p>
            <h2>Search Your Match</h2>
          </div>
        </div>
        <div className="header-actions">
          <button aria-label="Open filters" className="icon-button active" type="button">
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </header>
      <div className="search-scroll">
        <label className="search-box">
          <Search size={18} />
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by city, job, star"
            value={query}
          />
        </label>
        <div className="search-chips">
          {["Hyderabad", "Doctor", "Rohini", "Kundli", "Verified"].map((chip) => (
            <button key={chip} onClick={() => setQuery(chip)} type="button">
              {chip}
            </button>
          ))}
        </div>
        <section className="search-results">
          <h3>Recommended Telugu matches</h3>
          {visibleProfiles.map((profile) => (
            <button className="search-result-card" key={profile.id} onClick={() => onOpenProfile(profile.id)} type="button">
              <img alt={`${profile.name} profile`} src={profile.image} />
              <div>
                <h4>{profile.name}</h4>
                <p>
                  {profile.age} yrs - {profile.job} - {profile.city}
                </p>
                <span>{profile.star} star - {profile.kundli.score}</span>
              </div>
              <ChevronRight size={17} />
            </button>
          ))}
        </section>
      </div>
    </div>
  );
}

function NotificationScreen({ onBack, onOpenProfile }) {
  const notifications = [
    {
      title: "Sravani requested your photo",
      body: "Add a clear profile photo so her family can continue the match discussion.",
      profile: profiles[0],
      action: "Add photo",
    },
    {
      title: "Keerthana shared interest",
      body: "Her profile is verified and Kundli details are ready to compare.",
      profile: profiles[1],
      action: "View",
    },
    {
      title: "Madhavi asked for Kundli",
      body: "Upload or download Kundli details before sharing contact information.",
      profile: profiles[2],
      action: "Open",
    },
  ];

  return (
    <div className="screen notification-screen">
      <header className="filter-header">
        <button aria-label="Back" className="icon-button" onClick={onBack} type="button">
          <ArrowLeft size={20} />
        </button>
        <h2>Notifications</h2>
        <button aria-label="Add photo" className="icon-button active" type="button">
          <Camera size={18} />
        </button>
      </header>
      <div className="notification-scroll">
        <section className="photo-request-hero">
          <div>
            <p>Photo request</p>
            <h2>Add a recent photo to improve match replies.</h2>
          </div>
          <button type="button">
            <Plus size={18} />
            Upload
          </button>
        </section>
        <div className="notification-list">
          {notifications.map((item) => (
            <article className="notification-card" key={item.title}>
              <img alt={`${item.profile.name} profile`} src={item.profile.image} />
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <button onClick={() => onOpenProfile(item.profile.id)} type="button">
                  {item.action}
                  <ChevronRight size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function PremiumView({ isPaidMember, onActivatePaid }) {
  const premiumStats = [
    ["12,000+", "Kundli reports"],
    ["98%", "Satisfaction"],
    ["4.9", "User rating"],
  ];
  const premiumBenefits = [
    {
      icon: <Crown size={18} />,
      title: "Verified reach",
      body: "Show first in serious Telugu match lists.",
    },
    {
      icon: <Download size={18} />,
      title: "Kundli report",
      body: "Download and compare detailed astrology notes.",
    },
    {
      icon: <ShieldCheck size={18} />,
      title: "Privacy control",
      body: "Share photo, contact, and horoscope on approval.",
    },
  ];

  return (
    <div className="content-scroll premium-view">
      <header className="premium-page-header">
        <BrandLogo compact />
        <div>
          <p>Sonthangal Premium</p>
          <h2>Kundli, predictions & priority reach</h2>
        </div>
      </header>

      <section className="premium-hero-panel">
        <img alt="" className="premium-hero-bg" src={premiumImages.couple} />
        <div className="premium-hero-content">
          <span className="premium-kicker">Premium Membership</span>
          <h1>Unlock complete Kundli & life predictions</h1>
          <p>Get astrological insights, personalized predictions, and full Kundli reports in one premium experience.</p>
          <button onClick={onActivatePaid} type="button">
            {isPaidMember ? "Premium Active" : "Unlock Premium Access"}
            <Sparkles size={15} />
          </button>
        </div>
      </section>

      <section className="premium-stats">
        {premiumStats.map(([value, label]) => (
          <div key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="premium-discovery">
        <div>
          <span className="premium-kicker">Astrology insights</span>
          <h2>Discover what the stars say about you</h2>
          <ul>
            <li>No hidden charges</li>
            <li>Instant access after upgrade</li>
            <li>100% secure and private</li>
          </ul>
          <button onClick={onActivatePaid} type="button">{isPaidMember ? "Active Plan" : "Upgrade Now"}</button>
        </div>
        <img alt="Zodiac wheel for Kundli predictions" src={premiumImages.zodiac} />
      </section>

      <section className="premium-benefits">
        {premiumBenefits.map((benefit) => (
          <article key={benefit.title}>
            {benefit.icon}
            <div>
              <h3>{benefit.title}</h3>
              <p>{benefit.body}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function ProfileDetailView({ isPaidMember, liked, onBack, onKundliDownloaded, onLike, onRequestUpgrade, profile }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState("");
  const details = [
    ["Age", `${profile.age} yrs`],
    ["Height", profile.height],
    ["Mother tongue", profile.motherTongue],
    ["Education", profile.education],
    ["Profession", profile.job],
    ["Family", profile.family],
  ];

  async function handleDownloadKundli() {
    if (!isPaidMember) {
      onRequestUpgrade();
      return;
    }

    setIsDownloading(true);
    setDownloadStatus("");

    try {
      const { blob, fileName } = await downloadKundli(profile.id);
      saveBlob(blob, fileName);
      onKundliDownloaded();
      setDownloadStatus("Kundli PDF ready.");
    } catch (error) {
      setDownloadStatus(error.message);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="screen detail-screen">
      <header className="detail-topbar">
        <button aria-label="Back to matches" className="icon-button" onClick={onBack} type="button">
          <ArrowLeft size={20} />
        </button>
        <span>Profile details</span>
        <button className={liked ? "icon-button liked" : "icon-button"} onClick={onLike} type="button">
          <Heart size={18} />
        </button>
      </header>

      <div className="detail-scroll">
        <section className="detail-hero">
          <img alt={`${profile.name} profile`} src={profile.image} />
          <div className="detail-hero-copy">
            <span className="gold-badge">{profile.match}% match</span>
            {profile.isPaidMember ? <span className="member-badge">Paid member</span> : null}
            <h2>{profile.name}</h2>
            <p>{profile.city} - {profile.maritalStatus}</p>
          </div>
        </section>

        <section className="detail-section about-section">
          <h3>About</h3>
          <p>{profile.about}</p>
        </section>

        <section className="detail-section detail-grid">
          {details.map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </section>

        <section className="kundli-panel">
          <div className="kundli-main">
            <span>
              <FileText size={24} />
            </span>
            <div>
              <p>Kundli compatibility</p>
              <h3>{profile.kundli.score} star match</h3>
            </div>
          </div>
          <div className="kundli-facts">
            <KundliFact label="Star" value={profile.star} />
            <KundliFact label="Zodiac" value={profile.zodiac} />
            <KundliFact label="Birth time" value={profile.kundli.birthTime} />
            <KundliFact label="Birth place" value={profile.kundli.birthPlace} />
          </div>
          <button className="primary-action" disabled={isDownloading} onClick={handleDownloadKundli} type="button">
            {isDownloading ? "Preparing PDF..." : isPaidMember ? "Download Kundli PDF" : "Upgrade to Download Kundli"}
            {isPaidMember ? <Download size={18} /> : <Lock size={18} />}
          </button>
          {!isPaidMember ? <p className="kundli-lock-note">Only paid members can download all Kundli PDFs.</p> : null}
          {downloadStatus ? (
            <p className="download-status">
              <Clock3 size={15} />
              {downloadStatus}
            </p>
          ) : null}
        </section>
      </div>
    </div>
  );
}

function UpgradePlanModal({ onClose, onUpgrade }) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section aria-modal="true" className="upgrade-modal" role="dialog">
        <button aria-label="Close upgrade prompt" className="modal-close" onClick={onClose} type="button">
          <X size={18} />
        </button>
        <span className="modal-icon">
          <Crown size={28} />
        </span>
        <p>Premium required</p>
        <h2>Upgrade your plan to download Kundli PDFs</h2>
        <span>Paid members can download all Kundli reports, compare horoscope details, and unlock premium match insights.</span>
        <div className="modal-actions">
          <button className="primary-action" onClick={onUpgrade} type="button">
            View Premium Plans
            <ChevronRight size={18} />
          </button>
          <button className="modal-secondary" onClick={onClose} type="button">
            Maybe later
          </button>
        </div>
      </section>
    </div>
  );
}

function KundliFact({ label, value }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function MessagesView() {
  return (
    <div className="content-scroll messages-view">
      <section className="status-band dark">
        <div>
          <p>Inbox</p>
          <h2>Family conversations</h2>
        </div>
        <MessageCircle size={34} />
      </section>

      <div className="conversation-list">
        {conversations.map((conversation) => (
          <article className="conversation" key={conversation.name}>
            <img alt="" src={conversation.image} />
            <div>
              <h3>{conversation.name}</h3>
              <p>{conversation.status}</p>
            </div>
            <span>{conversation.time}</span>
            {conversation.unread ? <strong>{conversation.unread}</strong> : null}
          </article>
        ))}
      </div>
    </div>
  );
}

function ProfileView({ isPaidMember, onMarkPaid, onOpenPremium, profileStats }) {
  const checks = ["Photo ID", "Education", "Horoscope", "Family contact"];
  const loggedInProfile = profiles[3];
  const stats = [
    { label: "Viewed your profile", value: profileStats.viewedYou, icon: <Eye size={18} /> },
    { label: "Profiles checked", value: profileStats.profilesChecked, icon: <Search size={18} /> },
    { label: "Kundli downloaded", value: profileStats.kundliDownloads, icon: <Download size={18} /> },
    { label: "Profile shared", value: profileStats.profileShares, icon: <Share2 size={18} /> },
  ];

  return (
    <div className="content-scroll profile-view">
      <section className="profile-hero">
        <button aria-label="Update photo" className="camera-button" type="button">
          <Camera size={18} />
        </button>
        <img alt="Logged in member" src={loggedInProfile.image} />
        <span className={isPaidMember ? "profile-plan-badge paid" : "profile-plan-badge"}>
          {isPaidMember ? "Paid member" : "Free member"}
        </span>
        <h2>{loggedInProfile.name}</h2>
        <p>{loggedInProfile.age} yrs - {loggedInProfile.job} - {loggedInProfile.city}</p>
        <button className="upload-kundli-button" type="button">
          <Upload size={17} />
          Upload Kundli
        </button>
      </section>

      <section className="membership-panel">
        <div>
          <p>{isPaidMember ? "Premium active" : "Premium locked"}</p>
          <h3>{isPaidMember ? "All Kundli downloads are unlocked" : "Upgrade to download every Kundli"}</h3>
        </div>
        <button onClick={isPaidMember ? onMarkPaid : onOpenPremium} type="button">
          {isPaidMember ? "Active" : "Upgrade"}
        </button>
      </section>

      {!isPaidMember ? <PremiumBanner onOpenPremium={onOpenPremium} variant="profile" /> : null}

      <section className="profile-stat-panel">
        <div className="section-heading">
          <h3>Profile statistics</h3>
          <BarChartIcon />
        </div>
        <div className="profile-stat-grid">
          {stats.map((stat) => (
            <ProfileStatTile key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      <section className="verification-panel">
        <div className="section-heading">
          <h3>Verification</h3>
          <BadgeCheck size={20} />
        </div>
        {checks.map((check) => (
          <div className="check-row" key={check}>
            <span>
              <Check size={15} />
            </span>
            {check}
          </div>
        ))}
      </section>

      <section className="privacy-list">
        <h3>Matched support</h3>
        <PrivacyRow icon={<Headphones size={18} />} label="Match advisor" value="Get help shortlisting profiles" />
        <PrivacyRow icon={<MessageCircle size={18} />} label="Support chat" value="Ask about profile verification" />
      </section>

      <section className="privacy-list">
        <h3>Settings</h3>
        <PrivacyRow icon={<Pencil size={18} />} label="Edit profile" value="Update personal and family details" />
        <PrivacyRow icon={<KeyRound size={18} />} label="Change password" value="Refresh login security" />
        <PrivacyRow icon={<Settings size={18} />} label="Account settings" value="Notifications, privacy, and language" />
      </section>

      <section className="privacy-list">
        <h3>Privacy controls</h3>
        <PrivacyRow icon={<Lock size={18} />} label="Photo visibility" value="Approved matches" />
        <PrivacyRow icon={<Users size={18} />} label="Family number" value="After interest" />
        <PrivacyRow icon={<ShieldCheck size={18} />} label="Profile status" value="Verified" />
      </section>
    </div>
  );
}

function BarChartIcon() {
  return (
    <span className="mini-chart-icon" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

function ProfileStatTile({ icon, label, value }) {
  return (
    <div className="profile-stat-tile">
      <span>{icon}</span>
      <strong>{value}</strong>
      <p>{label}</p>
    </div>
  );
}

function CompactProfile({ liked, onLike, onOpenProfile, profile }) {
  return (
    <article className="compact-profile">
      <button className="profile-open-zone" onClick={onOpenProfile} type="button">
        <img alt={`${profile.name} profile`} src={profile.image} />
      </button>
      <button className="profile-copy-button" onClick={onOpenProfile} type="button">
        <h3>{profile.name}</h3>
        <p>
          {profile.age} yrs - {profile.job}
        </p>
        <span>
          <MapPin size={13} />
          {profile.city}
        </span>
      </button>
      <button
        aria-label={liked ? "Remove shortlist" : "Shortlist"}
        className={liked ? "small-like liked" : "small-like"}
        onClick={onLike}
        type="button"
      >
        <Heart size={17} />
      </button>
    </article>
  );
}

function MatchCard({ liked, onLike, onOpenProfile, profile }) {
  return (
    <article className="match-card">
      <img alt={`${profile.name} profile`} src={profile.image} />
      <div className="match-details">
        <div>
          <span className="gold-badge">{profile.match}% match</span>
          <h3>{profile.name}</h3>
          <p>
            {profile.age} yrs - {profile.job} - {profile.city}
          </p>
        </div>
        <div className="tag-line">
          {profile.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div className="card-actions">
          <button className="secondary-action" onClick={onOpenProfile} type="button">
            View profile
          </button>
          <button className={liked ? "icon-button liked" : "icon-button"} onClick={onLike} type="button">
            <Heart size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}

function PrivacyRow({ icon, label, value }) {
  return (
    <div className="privacy-row">
      <span>{icon}</span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
      <ChevronRight size={17} />
    </div>
  );
}

function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: "home", label: "Matches", icon: Heart },
    { id: "matches", label: "Shortlist", icon: FileText },
    { id: "messages", label: "Interest", icon: Send },
    { id: "profile", label: "Profile", icon: UserRound },
  ];

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            className={activeTab === tab.id ? "active" : ""}
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            type="button"
          >
            <Icon size={20} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default App;
