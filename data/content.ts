import { Article } from '../types';

/* -------------------------------------------------------------------------
   CONTENT GENERATION HELPERS
   ------------------------------------------------------------------------- */

const extendContent = (base: string[], category: string | string[], topic: string): string[] => {
    const catName = Array.isArray(category) ? category[0] : category;
    // If article is already long (e.g. featured article), return it.
    if (base.length >= 8) return base;

    return [
        ...base,
        `The ${topic} Context`,
        `The latest data from the ${topic} sector indicates a rapid acceleration of trends previously thought to be decades away. Experts in ${catName} are now calling for immediate, systemic intervention.`,
        "This is not an isolated event but part of a global pattern. Regional analysis shows similar disruptions occurring across both the Northern and Southern hemispheres, suggesting a synchronized shift in planetary systems.",
        "Systemic Impact Analysis",
        "When we analyze the broader ecosystem effects, we see a complex web of interactions. When one variable shifts—be it temperature, acidity, or policy—it triggers a cascade of secondary effects. For instance, recent changes in local biodiversity have already begun to alter soil composition, which in turn affects water retention and agricultural yields.",
        "We are attempting to repair a plane while flying it. The resilience of natural systems is being tested, and while some are showing surprising adaptability, others are nearing collapse. The data points we are seeing today are the early warning signals of this stress test.",
        "Future Outlook",
        "Looking forward, the implications of this development will ripple through the remainder of the decade. As we approach the 2030 milestones, the actions taken today will determine whether we meet our planetary boundaries or breach them irreversibly. GreenShift will continue to monitor this situation as new data becomes available."
    ];
};

const generateBodyContent = (category: string | string[], topic: string, excerpt: string): string[] => {
    const catName = Array.isArray(category) ? category[0] : category;
    return [
        excerpt,

        `Recent data indicates that ${topic} is becoming a central issue for ${catName} experts. The trends observed over the last quarter suggest a significant acceleration, prompting calls for immediate regulatory and industrial responses. We are seeing a convergence of multiple factors: rising public awareness, stricter government mandates, and technological breakthroughs that are finally making sustainable alternatives cost-competitive.`,
        "Historical Precedents",
        `To understand the current trajectory of ${topic}, we must look back at similar shifts in the ${catName} sector. Previous transitions—such as the move away from ozone-depleting substances or the initial adoption of renewable energy standards—followed a predictable S-curve of adoption. Early skepticism gave way to rapid institutional uptake once the economic case was proven. We are currently at the knee of that curve.`,
        "Systemic Implications",
        "Analysts warn that this is not an isolated phenomenon. The interplay between local environmental changes and global systems means that the impact of this event could ripple across borders. Verified sources from the IPCC and major monitoring agencies have flagged similar patterns in related sectors. For example, supply chain disruptions in one region are now causing price volatility in markets halfway across the globe, illustrating the fragility of our interconnected economy.",
        "Economic Impact Assessment",
        `The financial implications of ${topic} are staggering. Major insurance firms and investment banks are already adjusting their risk models to account for this new reality. Assets that were once considered safe bets are becoming stranded, while capital flows are increasingly redirected toward resilience and adaptation. This capital reallocation is driving innovation but also creating short-term market instability as incumbents struggle to pivot.`,
        "Technological and Policy Response",
        "In response to these developments, stakeholders are mobilizing resources to address the root causes. New frameworks are being proposed to mitigate risks, focusing on long-term sustainability rather than short-term fixes. The emphasis is shifting towards resilience and adaptation strategies. Governments are deploying subsidies and tax incentives to accelerate the transition, while the private sector is ramping up R&D spending to solve critical bottlenecks.",
        "Expert Consensus",
        `Leading voices in ${catName} agree that the time for incrementalism has passed. The consensus emerging from recent summits is that structural reform is necessary to address the scale of the challenge presented by ${topic}. Disagreement remains on the speed of implementation, but the direction of travel is no longer in dispute.`,
        "Future Outlook",
        `As we look towards 2030, the trajectory of ${topic} will likely define the broader ${catName} landscape. GreenShift will continue to monitor the data streams and provide updates as the situation evolves. The consensus among the scientific community remains clear: the window for effective action is narrowing, but the solutions are within reach. The decisions made in the next 18 months will likely determine the outcome for the next decade.`
    ];
};

/* -------------------------------------------------------------------------
   STATIC CONTENT DEFINITIONS
   ------------------------------------------------------------------------- */

export const heroContent = {
    headline: "The End of Cheap Plastic: Why Your Grocery Bill is About to Change Forever",
    subheadline: "It's not just a treaty; it's a global ban. Here is how the new 2026 plastics law actually works, and why Coca-Cola and Pepsi are panicking.",
    imageUrl: "https://placehold.co/1200x800?text=HERO_IMAGE", // Supermarket/Plastic shelves
    source: "GreenShift Original",
    date: "Jan 2026",
    url: "#"
};

export const aboutContent = {
    mission: "GreenShift is a curated intelligence platform dedicated to the most critical story of our time: the health of our planet. We aggregate verified data, scientific breakthroughs, and policy shifts to empower action through information.",
};

const featuredBase: Article = {
    id: 'gs-policy-2026',
    title: 'The End of Cheap Plastic: Why Your Grocery Bill is About to Change Forever',
    category: 'Pollution', topic: 'Pollution',
    source: 'GreenShift Original',
    imageUrl: 'https://placehold.co/1200x800?text=gs-policy-2026-main', // Supermarket context
    secondaryImageUrl: 'https://placehold.co/1200x800?text=gs-policy-2026-secondary', // Plastic bottles
    diagramUrl: 'https://placehold.co/1200x800?text=gs-policy-2026-diagram',
    excerpt: 'The days of $1 water bottles are over. A new global law has just made virgin plastic more expensive than gold, and big corporations are scrambling. Here is what you need to know.',
    date: 'Jan 2026',
    originalReadTime: '6 min read',
    url: '#',
    contextBox: {
        title: "The Production Cap",
        content: "For 50 years, plastic companies could make as much as they wanted. The new 2026 Global Plastics Treaty changes the rules: it limits how much *new* plastic can be created, forcing companies to recycle what already exists.",
        source: "UNEP 2026 Treaty Text"
    },
    content: [
        "Imagine walking into a supermarket and realizing that every single soda bottle looks different. Some are scratched. Some are slightly different shapes. None of them are that shiny, perfect, crinkly plastic you are used to. Welcome to 2026. The era of 'virgin' plastic—the brand new stuff made directly from oil—is officially over.",
        "For decades, we have been told that recycling is our responsibility. We were told to wash our yogurt cups and separate our trash. But while we were doing that, companies were churning out billions of tons of new plastic because it was cheaper than recycling the old stuff. It was a rigorous game of whack-a-mole where we were losing. Badly.",
        "That changed on January 1st. The Global Plastics Treaty didn't just suggest that companies should recycle; it made it illegal to produce cheap new plastic. If a company like Coca-Cola or Nestle wants to make a bottle today, they have two choices: use recycled plastic, which is now a hot commodity, or pay a massive tax on new plastic. Suddenly, recycling isn't just 'nice to have'—it is the only way to stay in business.",
        "The Panic in the Boardroom",
        "You might think big companies would fight this. And they did. For years, lobbyists tried to water down this law. They argued it would raise prices. They argued it was impossible. But when the gavel finally came down, something interesting happened. The panic shifted from 'how do we stop this law' to 'how do we find enough old plastic?'",
        "Right now, there is a gold rush happening. But people aren't digging for gold; they are digging for trash. Landfills that were seen as worthless piles of garbage are now being viewed as mines. Companies are literally buying trash because that trash is the only legal way they can package their products without going bankrupt.",
        "What This Means for You",
        "So, is your grocery bill going to go up? In the short term, yes. That $1 bottle of water might cost $1.50 for a while. Packaging is expensive right now. But here is the good news: the packaging you do buy is actually going to be recycled. For real this time.",
        "Before this law, only about 9% of plastic was actually recycled. The rest was burned or buried. Now that old plastic has value, no company is going to let it go to waste. They want that bottle back. You might start seeing 'reverse vending machines' everywhere, where you put a bottle in and get 20 cents back. Your trash is now money.",
        "The End of the Throwaway Culture",
        "This law forces us to stop treating materials as if they are infinite. We lived in a bubble where we thought we could use something for 5 minutes and throw it away forever. That bubble has burst. The 'throwaway economy' is being replaced by the 'circular economy'.",
        "It might feel annoying at first. You might have to carry a reusable cup more often. You might have to pay a deposit on your milk jug. But look at the alternative: an ocean filled with more plastic than fish. The price we are paying at the register today is the price of cleaning up the mess we made yesterday. And honestly? It’s a bargain."
    ]
};

export const featuredArticle = {
    ...featuredBase,
    content: extendContent(featuredBase.content, featuredBase.category, featuredBase.topic)
};

// Helper for bulk creation
const getRandomReadTime = () => {
    const min = 3;
    const max = 6;
    return `${Math.floor(Math.random() * (max - min + 1) + min)} min read`;
};

const createArticle = (id: string, title: string, category: string | string[], topic: string, excerpt: string, date: string, imageUrl: string): Article => ({
    id,
    title,
    category,
    topic,
    source: "GreenShift Intelligence",
    imageUrl,
    excerpt,
    date,
    originalReadTime: getRandomReadTime(),
    url: "#",
    contextBox: {
        title: `${topic} Analysis`,
        content: "This critical update is based on the latest verified data from international monitoring agencies.",
        source: "Global Data Stream 2026"
    },
    content: generateBodyContent(category, topic, excerpt)
});

// -----------------------------------------------------------------------------
// 80 ARTICLES (10 Per Category)
// -----------------------------------------------------------------------------

export const newsArticles: Article[] = [
    // --- 1. CLIMATE CHANGE ---
    createArticle('cc-1', "Global Temp Hits 1.5°C for 12 Consecutive Months", 'Science', 'Climate Change', "For the first time in history, the 12-month global average has exceeded the Paris Agreement limit.", "Jan 2026", "https://placehold.co/1200x800?text=cc-1"), // Heat sun
    createArticle('cc-2', "Antarctic Heatwave: 30°C Above Normal", 'Science', 'Climate Change', "Unprecedented temperatures in East Antarctica are rewriting climate models.", "Feb 2026", "https://placehold.co/1200x800?text=cc-2"), // Iceberg
    createArticle('cc-3', "The Carbon Budget is Officially Depleted", 'Science', 'Climate Change', "New analysis suggests we have crossed the threshold for 50% probability of staying under 1.5°C.", "Jan 2026", "https://placehold.co/1200x800?text=cc-3"), // Industrial smoke
    createArticle('cc-4', "The Cost of Extreme Weather: $3 Trillion in 2025", 'Economy', 'Climate Change', "Reinsurers warn that large parts of the globe are becoming uninsurable.", "Dec 2025", "https://placehold.co/1200x800?text=cc-4"), // Storm flood
    createArticle('cc-5', "Methane Feedback Loops Detected in Siberia", 'Science', 'Climate Change', "Exploding permafrost craters are releasing ancient methane caches.", "Feb 2026", "https://placehold.co/1200x800?text=cc-5"), // Tundra
    createArticle('cc-6', "Attribution Science: Naming the Hurricane", 'Science', 'Climate Change', "Scientists can now calculate exactly how much climate change intensified a specific storm.", "Jan 2026", "https://placehold.co/1200x800?text=cc-6"), // Hurricane space
    createArticle('cc-7', "Global South Adaptation Fund Shortfall", 'Policy', 'Climate Change', "Developing nations demand fulfilled pledges at the latest summit.", "Dec 2025", "https://placehold.co/1200x800?text=cc-7"), // Dry cracked earth
    createArticle('cc-8', "Jet Stream Instability: Why Winter is Weird", 'Science', 'Climate Change', "A weakening polar vortex is causing chaotic weather patterns in the Northern Hemisphere.", "Feb 2026", "https://placehold.co/1200x800?text=cc-8"), // Weather map
    createArticle('cc-9', "Ocean Circulation Slowdown Confirmed", 'Science', 'Climate Change', "Sensors in the Atlantic confirm the AMOC is at its weakest in a millennium.", "Jan 2026", "https://placehold.co/1200x800?text=cc-9"), // Ocean waves
    createArticle('cc-10', "Urban Heat Islands: Cities are 10°C Hotter", 'Science', 'Climate Change', "New thermal mapping exposes the deadly impact of concrete over greenery.", "Dec 2025", "https://placehold.co/1200x800?text=cc-10"), // City aerial

    // --- 2. ENERGY ---
    createArticle('en-1', "Perovskite Solar Record: 35% Efficiency", 'Innovation', 'Energy', "A breakthrough in tandem solar cells makes panels cheaper and more powerful.", "Feb 2026", "https://placehold.co/1200x800?text=en-1"), // Solar panels
    createArticle('en-2', "Fusion Power: Commercial Pilot Announced", 'Innovation', 'Energy', "Following net energy gain, the first commercial fusion plant breaks ground in France.", "Feb 2026", "https://placehold.co/1200x800?text=en-2"), // Science reactor abstract
    createArticle('en-3', "Iron-Air Batteries Scale Up", 'Innovation', 'Energy', "Rust-based batteries are solving the grid storage problem for days, not hours.", "Feb 2026", "https://placehold.co/1200x800?text=en-3"), // Power grid
    createArticle('en-4', "Offshore Wind: Floating Turbines Go Deep", 'Innovation', 'Energy', "New floating tech unlocks wind energy in deep waters previously inaccessible.", "Feb 2026", "https://placehold.co/1200x800?text=en-4"), // Wind turbines
    createArticle('en-5', "Geothermal: The Superhot Rock Revolution", 'Innovation', 'Energy', "Deep drilling allows geothermal energy to be accessed anywhere, not just volcanic zones.", "Feb 2026", "https://placehold.co/1200x800?text=en-5"), // Geothermal steam
    createArticle('en-6', "Global Coal Peak: It Happened in 2025", 'Economy', 'Energy', "IEA confirms coal consumption has entered structural decline.", "Jan 2026", "https://placehold.co/1200x800?text=en-6"), // Coal pile
    createArticle('en-7', "Hydrogen Transport: Heavy Trucking shifts", 'Innovation', 'Energy', "Green hydrogen infrastructure is finally ready for long-haul logistics.", "Feb 2026", "https://placehold.co/1200x800?text=en-7"), // Truck abstract
    createArticle('en-8', "Solid State Batteries: EV Range Doubled", 'Innovation', 'Energy', "Toyota and VW release first mass-market cars with 1000km range.", "Jan 2026", "https://placehold.co/1200x800?text=en-8"), // EV charging
    createArticle('en-9', "Small Modular Reactors (SMRs) Go Online", 'Innovation', 'Energy', "Factory-built nuclear reactors begin powering remote communities.", "Dec 2025", "https://placehold.co/1200x800?text=en-9"), // Nuclear cooling tower
    createArticle('en-10', "Virtual Power Plants Stabilize the Grid", 'Action', 'Energy', "Home batteries networked together saved California from blackouts this winter.", "Feb 2026", "https://placehold.co/1200x800?text=en-10"), // Smart home grid

    // --- 3. POLLUTION ---
    createArticle('pol-1', "Global Plastics Treaty Signed", 'Policy', 'Pollution', "Legally binding caps on plastic production come into force.", "Jan 2026", "https://placehold.co/1200x800?text=pol-1"), // Plastic waste
    createArticle('pol-2', "PFAS Total Ban: The End of Teflon", 'Policy', 'Pollution', "EU and US regulators agree on a complete phase-out of forever chemicals.", "Feb 2026", "https://placehold.co/1200x800?text=pol-2"), // Lab test tubes
    createArticle('pol-3', "Microplastics Found in Human Hearts", 'Science', 'Pollution', "New medical study confirms plastic particles are crossing biological barriers.", "Dec 2025", "https://placehold.co/1200x800?text=pol-3"), // Microscope abstract
    createArticle('pol-4', "E-Waste Recycling Hits 90% in Nordic Nations", 'Policy', 'Pollution', "Strict deposit schemes prove that circular electronics are possible.", "Jan 2026", "https://placehold.co/1200x800?text=pol-4"), // E-waste
    createArticle('pol-5', "Ocean Cleanup: System 03 Success", 'Innovation', 'Pollution', "The Great Pacific Garbage Patch is shrinking for the first time.", "Feb 2026", "https://placehold.co/1200x800?text=pol-5"), // Ocean plastic
    createArticle('pol-6', "Nitrogen Crisis: Farming Runoff Rules", 'Policy', 'Pollution', "New legislation targets algal blooms by capping fertilizer use.", "Jan 2026", "https://placehold.co/1200x800?text=pol-6"), // Algae/Water
    createArticle('pol-7', "Air Quality AI: Street-Level Monitoring", 'Innovation', 'Pollution', "Hyper-local sensors reveal inequality in urban smog exposure.", "Dec 2025", "https://placehold.co/1200x800?text=pol-7"), // Smog city
    createArticle('pol-8', "Right to Repair Electronics Act", 'Policy', 'Pollution', "Manufacturers must now provide parts and manuals for 10 years.", "Feb 2026", "https://placehold.co/1200x800?text=pol-8"), // Repair electronics
    createArticle('pol-9', "Chemical Fertilizer Tax Implemented", 'Economy', 'Pollution', "Incentivizing regenerative agriculture through fiscal policy.", "Jan 2026", "https://placehold.co/1200x800?text=pol-9"), // Farm field
    createArticle('pol-10', "Space Debris Removal Mission Launches", 'Innovation', 'Pollution', "First commercial satellite capture successfully demonstrates orbit cleanup.", "Feb 2026", "https://placehold.co/1200x800?text=pol-10"), // Satellite space

    // --- 4. POLICY & ECONOMICS ---
    createArticle('pe-1', "Carbon Border Tax (CBAM) Global Rollout", 'Policy', 'Policy & Economics', "Imports to the EU and UK now face levies based on their carbon footprint.", "Jan 2026", "https://placehold.co/1200x800?text=pe-1"), // Shipping containers
    createArticle('pe-2', "Beyond GDP: Adopting Green Ecosystem Product", 'Economy', 'Policy & Economics', "Five nations replace GDP with GEP to measure true economic health.", "Feb 2026", "https://placehold.co/1200x800?text=pe-2"), // Economy graph
    createArticle('pe-3', "Fossil Fuel Divestment Hits $50 Trillion", 'Economy', 'Policy & Economics', "Pension funds continue the mass exodus from oil and gas assets.", "Dec 2025", "https://placehold.co/1200x800?text=pe-3"), // Stock market
    createArticle('pe-4', "Ecocide Law Recognized by ICC", 'Policy', 'Policy & Economics', "Destruction of ecosystems can now be prosecuted as a crime against humanity.", "Jan 2026", "https://placehold.co/1200x800?text=pe-4"), // Gavel
    createArticle('pe-5', "Climate Migration Visas Established", 'Policy', 'Policy & Economics', "New Zealand creates legal pathway for Pacific islanders displaced by sea level rise.", "Feb 2026", "https://placehold.co/1200x800?text=pe-5"), // Island coast
    createArticle('pe-6', "Corporate Liability: CEOs Sued Personally", 'Policy', 'Policy & Economics', "Landmark ruling holds directors accountable for climate risk negligence.", "Jan 2026", "https://placehold.co/1200x800?text=pe-6"), // Business suit
    createArticle('pe-7', "Subsidies Shift: From Fossil to Green", 'Economy', 'Policy & Economics', "G20 nations agree to redirect $500B in oil subsidies to renewables.", "Dec 2025", "https://placehold.co/1200x800?text=pe-7"), // Wind turbine graph
    createArticle('pe-8', "Circular Economy Act Enforced", 'Policy', 'Policy & Economics', "Mandatory recycling and durability standards for all consumer goods.", "Jan 2026", "https://placehold.co/1200x800?text=pe-8"), // Recycling symbol
    createArticle('pe-9', "Just Transition Fund Operational", 'Policy', 'Policy & Economics', "Billions allocated to retrain coal workers for the clean energy sector.", "Jan 2026", "https://placehold.co/1200x800?text=pe-9"), // Industry worker
    createArticle('pe-10', "Insurance Market Retreat", 'Economy', 'Policy & Economics', "Major insurers pull coverage from coastal zones, triggering real estate shock.", "Jan 2026", "https://placehold.co/1200x800?text=pe-10"), // House flooded

    // --- 5. OCEANS ---
    createArticle('oc-1', "High Seas Treaty Ratified", 'Policy', 'Oceans', "Protection now extends to international waters, covering 60% of the ocean.", "Jan 2026", "https://placehold.co/1200x800?text=oc-1"), // Open ocean
    createArticle('oc-2', "Deep Sea Mining Moratorium", 'Policy', 'Oceans', "Nations vote to pause seabed mining until environmental impacts are understood.", "Feb 2026", "https://placehold.co/1200x800?text=oc-2"), // Deep sea abstract
    createArticle('oc-3', "Coral Reef 3D Printing Success", 'Science', 'Oceans', "Artificial structures are successfully hosting new polyps in the Great Barrier Reef.", "Dec 2025", "https://placehold.co/1200x800?text=oc-3"), // Coral reef
    createArticle('oc-4', "Seagrass Restoration Scales Up", 'Conservation', 'Oceans', "Robotic planting of seagrass meadows to capture blue carbon.", "Jan 2026", "https://placehold.co/1200x800?text=oc-4"), // Underwater grass
    createArticle('oc-5', "Arctic Ocean Acidification Alert", 'Science', 'Oceans', "pH levels in the north are dropping faster than anywhere else on Earth.", "Feb 2026", "https://placehold.co/1200x800?text=oc-5"), // Arctic water
    createArticle('oc-6', "Whale Carbon Credits Launched", 'Economy', 'Oceans', "Financial market now values whales for their carbon sequestration role.", "Jan 2026", "https://placehold.co/1200x800?text=oc-6"), // Whale tail
    createArticle('oc-7', "Sustainable Fisheries Tech", 'Innovation', 'Oceans', "AI cameras on nets reduce bycatch by 95% in commercial fleets.", "Dec 2025", "https://placehold.co/1200x800?text=oc-7"), // Fishing boat
    createArticle('oc-8', "Ocean Thermal Energy Conversion", 'Innovation', 'Oceans', "OTEC plant in Hawaii proves viability of temperature-gradient power.", "Feb 2026", "https://placehold.co/1200x800?text=oc-8"), // Ocean waves horizon
    createArticle('oc-9', "Plastic Free Coastlines Initiative", 'Action', 'Oceans', "Global volunteer network clears record tonnage from beaches.", "Jan 2026", "https://placehold.co/1200x800?text=oc-9"), // Beach clean
    createArticle('oc-10', "Marine Protected Areas Hit 30%", 'Conservation', 'Oceans', "The world achieves the 30x30 target for ocean conservation early.", "Dec 2025", "https://placehold.co/1200x800?text=oc-10"), // School of fish

    // --- 6. BIODIVERSITY ---
    createArticle('bio-1', "30x30 Target Met on Land", 'Policy', 'Biodiversity', "30% of global land is now under protection status.", "Jan 2026", "https://placehold.co/1200x800?text=bio-1"), // Green forest aerial
    createArticle('bio-2', "De-Extinction: Mammoth Genes Edited", 'Science', 'Biodiversity', "Colossal Biosciences creates first viable mammoth hybrid embryo.", "Feb 2026", "https://placehold.co/1200x800?text=bio-2"), // Elephant
    createArticle('bio-3', "Indigenous Guardianship Programs", 'Policy', 'Biodiversity', "Returning land management rights to indigenous groups boosts biodiversity.", "Dec 2025", "https://placehold.co/1200x800?text=bio-3"), // Nature person
    createArticle('bio-4', "Pollinator Recovery Plan", 'Conservation', 'Biodiversity', "Banning neonics leads to bounce back in wild bee populations.", "Jan 2026", "https://placehold.co/1200x800?text=bio-4"), // Bee
    createArticle('bio-5', "Invasive Species AI Monitoring", 'Innovation', 'Biodiversity', "Autonomous drones identify and map invasive plants in real-time.", "Feb 2026", "https://placehold.co/1200x800?text=bio-5"), // Drone forest
    createArticle('bio-6', "Soil Microbiome Mapping", 'Science', 'Biodiversity', "Global census of soil bacteria reveals the hidden web of life.", "Jan 2026", "https://placehold.co/1200x800?text=bio-6"), // Plant sprout soil
    createArticle('bio-7', "Wildlife Corridors Connect Continents", 'Conservation', 'Biodiversity', "New 'Highway for Nature' links national parks across borders.", "Dec 2025", "https://placehold.co/1200x800?text=bio-7"), // Landscape
    createArticle('bio-8', "Amazon Tipping Point Averted?", 'Science', 'Biodiversity', "Deforestation rates drop to near zero, giving the rainforest a chance.", "Feb 2026", "https://placehold.co/1200x800?text=bio-8"), // Amazon aerial
    createArticle('bio-9', "Global Seed Vault Expansion", 'Conservation', 'Biodiversity', "Svalbard receives largest ever deposit of crop varieties.", "Jan 2026", "https://placehold.co/1200x800?text=bio-9"), // Svalbard
    createArticle('bio-10', "Rewilding Europe: The Bison Return", 'Conservation', 'Biodiversity', "Herds of wild bison roam the UK and Germany for the first time in centuries.", "Dec 2025", "https://placehold.co/1200x800?text=bio-10"), // Bison

    // --- 7. CONSERVATION ---
    createArticle('con-1', "Congo Basin Protection Deal", 'Policy', 'Conservation', "Historic agreement to preserve the world's second lung.", "Jan 2026", "https://placehold.co/1200x800?text=con-1"), // Jungle river
    createArticle('con-2', "Wetland Credits Market Booms", 'Economy', 'Conservation', "Financial incentives drive massive peatland restoration.", "Feb 2026", "https://placehold.co/1200x800?text=con-2"), // Wetland
    createArticle('con-3', "Anti-Poaching Drones Success", 'Innovation', 'Conservation', "Thermal imaging drones reduce Rhino poaching to zero in key parks.", "Dec 2025", "https://placehold.co/1200x800?text=con-3"), // Rhino
    createArticle('con-4', "River Rights Movement", 'Policy', 'Conservation', "More rivers granted legal personhood status in South America.", "Jan 2026", "https://placehold.co/1200x800?text=con-4"), // River
    createArticle('con-5', "Forest Stewardship Council 2.0", 'Policy', 'Conservation', "Stricter standards for sustainable timber eradicate loopholes.", "Feb 2026", "https://placehold.co/1200x800?text=con-5"), // Forest lumber
    createArticle('con-6', "Desert Greening Projects", 'Innovation', 'Conservation', "Great Green Wall in Africa shows visible progress from space.", "Jan 2026", "https://placehold.co/1200x800?text=con-6"), // Desert plant
    createArticle('con-7', "Urban Nature Reserves", 'Action', 'Conservation', "Cities converting golf courses into public wildlands.", "Dec 2025", "https://placehold.co/1200x800?text=con-7"), // Park city
    createArticle('con-8', "National Parks Digital Twin", 'Innovation', 'Conservation', "VR tourism generates revenue for parks without the foot traffic.", "Feb 2026", "https://placehold.co/1200x800?text=con-8"), // VR nature
    createArticle('con-9', "Community Conservation Fund", 'Action', 'Conservation', "Crowdfunding buys huge tracts of Patagonian wilderness.", "Jan 2026", "https://placehold.co/1200x800?text=con-9"), // Mountains
    createArticle('con-10', "Endangered Species Recovery", 'Science', 'Conservation', "Tiger numbers double in Nepal thanks to habitat corridors.", "Dec 2025", "https://placehold.co/1200x800?text=con-10"), // Tiger

    // --- 8. SOLUTIONS ---
    createArticle('sol-1', "Direct Air Capture Hubs Online", 'Innovation', 'Solutions', "Massive carbon sucking plants in Texas and Iceland begin operations.", "Jan 2026", "https://placehold.co/1200x800?text=sol-1"), // Industrial plant
    createArticle('sol-2', "Lab-Grown Meat Price Parity", 'Economy', 'Solutions', "Cultivated chicken is now cheaper than farmed chicken in Singapore.", "Feb 2026", "https://placehold.co/1200x800?text=sol-2"), // Lab petri dish
    createArticle('sol-3', "15-Minute Cities Success", 'Policy', 'Solutions', "Paris report shows 40% drop in car traffic and improved mental health.", "Dec 2025", "https://placehold.co/1200x800?text=sol-3"), // Biking city
    createArticle('sol-4', "Hempcrete Construction Boom", 'Innovation', 'Solutions', "Carbon-negative building materials gain mainstream adoption.", "Jan 2026", "https://placehold.co/1200x800?text=sol-4"), // Construction
    createArticle('sol-5', "Algae Bioplastics", 'Innovation', 'Solutions', "Seaweed-based packaging replaces single-use plastics in major supermarkets.", "Feb 2026", "https://placehold.co/1200x800?text=sol-5"), // Seaweed
    createArticle('sol-6', "Passive Cooling Architecture", 'Innovation', 'Solutions', "Ancient techniques revived to cool buildings without AC.", "Jan 2026", "https://placehold.co/1200x800?text=sol-6"), // Modern architecture
    createArticle('sol-7', "Precision Agriculture AI", 'Innovation', 'Solutions', "Robots reduce herbicide use by 90% through spot-spraying.", "Dec 2025", "https://placehold.co/1200x800?text=sol-7"), // Farm drone
    createArticle('sol-8', "Desalination Solar Tech", 'Innovation', 'Solutions', "New zero-brine solar domes provide water for arid regions.", "Feb 2026", "https://placehold.co/1200x800?text=sol-8"), // Water plant
    createArticle('sol-9', "Circular Fashion Industry", 'Economy', 'Solutions', "Resale market overtakes fast fashion for the first time.", "Jan 2026", "https://placehold.co/1200x800?text=sol-9"), // Clothes rack
    createArticle('sol-10', "Carbon Negative Concrete", 'Innovation', 'Solutions', "New cement recipe absorbs CO2 as it cures.", "Feb 2026", "https://placehold.co/1200x800?text=sol-10"), // Concrete
];

export const upcomingEvents: Article[] = [
    {
        id: 'evt-cop30',
        title: 'UN Climate Change Conference (COP30)',
        category: 'Global Summit', topic: 'Global Summit',
        source: 'UNFCCC',
        imageUrl: 'https://placehold.co/1200x800?text=evt-cop30', // Conference/UN
        excerpt: 'World leaders convene in Belém, Brazil, to finalize the new collective quantified goal on climate finance and adaptation strategies.',
        date: 'Nov 10-21, 2026',
        originalReadTime: '5 min read',
        url: '#',
        content: [
            "The 30th Conference of the Parties (COP30) represents a pivotal moment in global climate diplomacy. Hosted in the heart of the Amazon, in Belém, Brazil, this summit carries a symbolic weight unmatched by its predecessors. The choice of location is no accident; it forces the international community to confront the reality of the biome that serves as the planet's lungs, currently teetering on the edge of a dieback tipping point. The Brazilian presidency has framed this as the 'Tropical COP', placing nature-based solutions and the bioeconomy at the center of the negotiation table.",
            "Finance: The Elephant in the Room",
            "The primary technical objective of COP30 is the finalization of the New Collective Quantified Goal (NCQG) on climate finance. The previous target of $100 billion annually, set in 2009, has been widely criticized as insufficient and rarely met in practice. Developing nations, particularly the G77 and China block, are pushing for a new floor of at least $1 trillion annually to cover mitigation, adaptation, and loss and damage. The debate is not just about the number, but the quality of finance—grants versus loans—and the contributor base. Should emerging economies like China and Saudi Arabia now contribute?",
            "The Adaptation Gap",
            "While mitigation (cutting emissions) often steals the headlines, COP30 faces intense pressure to deliver on the Global Goal on Adaptation (GGA). Climate impacts are no longer theoretical; they are visceral. From the floods in Pakistan to the droughts in the Horn of Africa, the Global South is demanding a finalized framework for measuring adaptation progress. Without clear metrics, adaptation finance remains a black box, difficult to track and easy to ignore. The Belém summit is expected to produce a standardized set of indicators for resilience, water security, and agricultural stability.",
            "Article 6 and Carbon Markets",
            "The rules for international carbon trading under Article 6 of the Paris Agreement remain a contentious sticking point. After the failures to reach consensus at previous COPs, there is a renewed urgency to operationalize a high-integrity carbon market. The risk, however, is a 'race to the bottom' where countries trade 'hot air' credits that do not represent real emission reductions. The integrity of forest carbon credits, in particular, will be under the microscope given the Amazonian backdrop. A failure here could undermine the credibility of the entire Paris mechanism.",
            "The Road Ahead",
            "COP30 is not just a meeting; it is a stress test for multilateralism. In a fragmented geopolitical landscape, can nations still cooperate on an existential threat? The outcome in Belém will determine whether the 1.5°C target remains a viable policy goal or becomes a memorial to lost time. GreenShift will be monitoring the negotiating texts daily, specifically tracking the brackets—the disputed language—that tell the real story of the summit."
        ],
        contextBox: {
            title: "Why Belém Matters",
            content: "Hosting the talks in the Amazon highlights the critical link between biodiversity loss and climate change. It is the first time the summit takes place within a biome that actively regulates the global carbon cycle.",
            source: "Brazilian Government Statement"
        }
    },
    {
        id: 'evt-plastics',
        title: 'Final Ratification: Global Plastics Treaty',
        category: 'Legislation', topic: 'Legislation',
        source: 'UN Environment Assembly',
        imageUrl: 'https://placehold.co/1200x800?text=evt-plastics', // Plastic bottle beach
        excerpt: 'Delegates meet in Paris to sign the finalized text of the international legally binding instrument on plastic pollution.',
        date: 'Dec 1-5, 2026',
        originalReadTime: '4 min read',
        url: '#',
        content: [
            "After years of negotiation, the Intergovernmental Negotiating Committee (INC) is set to convene in Paris for the diplomatic plenipotentiary conference to sign the Global Plastics Treaty. This agreement is being hailed as the most significant environmental accord since the Paris Agreement of 2015. Unlike previous voluntary frameworks, this treaty is a legally binding international instrument designed to address the full lifecycle of plastic, including its production, design, and disposal.",
            "The Battle Lines: Upstream vs. Downstream",
            "The core tension of the negotiations has been between the 'High Ambition Coalition' (led by Rwanda and Norway) and a group of petrochemical-producing nations. The former argues for 'upstream' measures: capping the production of virgin plastic polymers. They contend that we cannot recycle our way out of a crisis where production is set to triple by 2060. The latter group has fought to limit the treaty's scope to 'downstream' waste management—essentially focusing on recycling and cleanup rather than production limits.",
            "Chemicals of Concern",
            "A critical, often overlooked component of the treaty is the regulation of hazardous chemicals used in plastic production. There are over 13,000 chemicals associated with plastics, many of which are known carcinogens or endocrine disruptors. The finalized text creates a 'negative list' of banned substances and a 'watch list' for those requiring further study. This shift forces manufacturers to disclose the chemical composition of their packaging, a transparency requirement that industry lobbyists have fought tooth and nail.",
            "Extended Producer Responsibility (EPR)",
            "The treaty establishes global standards for Extended Producer Responsibility schemes. EPR mandates that the companies producing plastic products are financially and physically responsible for them at the end of their life. This shifts the burden from municipal taxpayers to corporations like Coca-Cola, Unilever, and Nestlé. Under the new rules, these companies will pay fees based on the recyclability of their packaging, creating a direct financial incentive to simplify designs and eliminate multi-layered, hard-to-recycle materials.",
            "Implementation Challenges",
            "Signing the treaty is only the first step. The real test lies in ratification and domestic implementation. Nations will need to rewrite national waste laws, invest in new infrastructure, and enforce bans on single-use items. For the Global South, the treaty includes a financial mechanism to support this transition, though the exact funding levels remain a point of eleventh-hour negotiation. The treaty represents a fundamental shift in how humanity interacts with materials, signaling the end of the 'take-make-waste' era."
        ],
        contextBox: {
            title: "The Scale of the Problem",
            content: "Without this treaty, plastic leakage into the ocean is projected to nearly triple by 2040, flowing into the sea at a rate of 29 million metric tons per year.",
            source: "Pew Charitable Trusts / SYSTEMIQ"
        }
    },
    {
        id: 'evt-imo',
        title: 'IMO Marine Environment Protection Committee (MEPC 85)',
        category: 'Maritime Law', topic: 'Maritime Law',
        source: 'International Maritime Organization',
        imageUrl: 'https://placehold.co/1200x800?text=evt-imo', // Ship container
        excerpt: 'The shipping industry faces a deadline to adopt market-based measures for decarbonization, including a potential carbon levy on fuel.',
        date: 'Oct 2026',
        originalReadTime: '5 min read',
        url: '#',
        content: [
            "The shipping industry, responsible for nearly 3% of global greenhouse gas emissions, is approaching a reckoning. The International Maritime Organization (IMO) meets for its 85th Marine Environment Protection Committee (MEPC 85) session in London, facing a deadline to adopt the 'mid-term measures' necessary to meet its 2050 net-zero strategy. The discussions are technical, but the implications are global: they will determine the price of shipping every container, commodity, and consumer good moving across the ocean.",
            "The Carbon Levy",
            "The centerpiece of the negotiation is a global carbon pricing mechanism. The proposal on the table is a levy on greenhouse gas emissions from ships—essentially a tax on heavy fuel oil. The revenue generated, estimated at $40-$60 billion annually, would be split. Part would go to a fund to reward early adopters of zero-emission fuels (like green ammonia and methanol), closing the price gap with fossil fuels. The rest would support a 'just transition' for developing states, particularly Pacific Islands nations that are most remote and vulnerable to rising shipping costs.",
            "Well-to-Wake vs. Tank-to-Wake",
            "A critical technical battle is being fought over how emissions are calculated. High-ambition states are demanding a 'Well-to-Wake' lifecycle analysis. This means counting the emissions produced during the extraction and refining of the fuel, not just what comes out of the ship's smokestack ('Tank-to-Wake'). This distinction is vital for alternative fuels like hydrogen or ammonia; if they are produced using coal-fired electricity (brown ammonia), a Well-to-Wake calculation would reveal them as dirty, preventing a false solution.",
            "The Efficiency Standard",
            "Running parallel to the levy is the Global Fuel Standard (GFS). This regulation mandates a stepwise reduction in the carbon intensity of marine fuels, ratcheting down every five years. By 2030, ships will need to reduce intensity by at least 5%, forcing older, inefficient vessels to either slow down ('slow steaming') or be scrapped. This regulatory pincer movement—a tax on carbon and a mandate for cleaner fuel—is designed to force a rapid technological shift.",
            "Geopolitical Friction",
            "China, Brazil, and Argentina have previously expressed concern that a carbon levy acts as a trade tariff on their exports. MEPC 85 is the moment where compromise must be reached. Failure to adopt these measures would likely trigger regional fragmentation, with the EU extending its own Emissions Trading System (ETS) further, creating a chaotic patchwork of maritime regulations. The IMO is under immense pressure to prove it can regulate its own sector effectively."
        ],
        contextBox: {
            title: "The Fuel Transition",
            content: "To meet the 2030 targets, at least 5% of the energy used by international shipping must come from zero or near-zero emission technologies. Currently, that figure is less than 0.2%.",
            source: "Global Maritime Forum"
        }
    },
    {
        id: 'evt-cbd',
        title: 'Convention on Biological Diversity (COP17)',
        category: 'Biodiversity', topic: 'Biodiversity',
        source: 'CBD Secretariat',
        imageUrl: 'https://placehold.co/1200x800?text=evt-cbd', // Jungle forest
        excerpt: 'Evaluating the implementation of the Kunming-Montreal Global Biodiversity Framework two years in.',
        date: 'Late 2026',
        originalReadTime: '4 min read',
        url: '#',
        content: [
            "Two years after the historic adoption of the Kunming-Montreal Global Biodiversity Framework (GBF), the world's nations reconvene for COP17. If COP15 was about setting the targets—most notably the '30x30' goal to protect 30% of land and oceans by 2030—COP17 is entirely about implementation. The honeymoon period of high-level pledges is over; now, delegates must present their National Biodiversity Strategies and Action Plans (NBSAPs) to prove they are actually doing the work.",
            "The 30x30 Reality Check",
            "Early analysis suggests a mixed bag of progress. While marine protected areas have expanded, terrestrial protection often clashes with agricultural expansion and extractive industries. A key focus at COP17 is the quality of protection. 'Paper parks'—areas that are protected in name only but suffer from unchecked poaching or logging—remain a plague on conservation data. The Secretariat is pushing for a rigorous monitoring framework that uses satellite data and eDNA (environmental DNA) to verify biodiversity health, not just acreage.",
            "Biocredits and Nature Finance",
            "Just as carbon markets dominated climate talks, biodiversity credits are taking center stage here. The concept is to create a market mechanism where companies pay for the preservation or restoration of biodiversity units (e.g., a hectare of healthy rainforest or a restored coral reef). Proponents argue this unlocks private capital for nature. Skeptics warn of the extreme difficulty in commodifying nature—a tree is easier to measure than an ecosystem. COP17 aims to establish global integrity standards to prevent greenwashing in this nascent market.",
            "Indigenous Rights and DSI",
            "A critical thread running through the negotiations is the issue of Digital Sequence Information (DSI). This refers to genetic data from plants and animals that is stored digitally and used to develop medicines and commercial products. Historically, companies have used this data without compensating the countries or communities where the genetic resources originated—a practice known as biopiracy. COP17 is expected to operationalize a multilateral benefit-sharing mechanism, ensuring that profits from nature's genetics flow back to its guardians.",
            "The Stake",
            "With one million species at risk of extinction, the window for action is closing. The success of COP17 will be measured not by new promises, but by the flow of funds to the Global South and the legal enforcement of protection zones. It is a test of whether humanity can value the web of life before it unravels."
        ],
        contextBox: {
            title: "The Financing Gap",
            content: "The biodiversity financing gap is estimated at $700 billion per year. Current flows are roughly $140 billion, mostly from public subsidies.",
            source: "Paulson Institute"
        }
    }
];