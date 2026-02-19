
const extendContent = (base, category, topic) => {
    // If article is already long (e.g. featured article), return it.
    if (base.length >= 8) return base;

    return [
        ...base,
        `The ${topic} Context`,
        `The latest data from the ${topic} sector indicates a rapid acceleration of trends previously thought to be decades away. Experts in ${category} are now calling for immediate, systemic intervention.`,
        "This is not an isolated event but part of a global pattern. Regional analysis shows similar disruptions occurring across both the Northern and Southern hemispheres, suggesting a synchronized shift in planetary systems.",
        "Systemic Impact Analysis",
        "When we analyze the broader ecosystem effects, we see a complex web of interactions. When one variable shifts—be it temperature, acidity, or policy—it triggers a cascade of secondary effects. For instance, recent changes in local biodiversity have already begun to alter soil composition, which in turn affects water retention and agricultural yields.",
        "We are attempting to repair a plane while flying it. The resilience of natural systems is being tested, and while some are showing surprising adaptability, others are nearing collapse. The data points we are seeing today are the early warning signals of this stress test.",
        "Future Outlook",
        "Looking forward, the implications of this development will ripple through the remainder of the decade. As we approach the 2030 milestones, the actions taken today will determine whether we meet our planetary boundaries or breach them irreversibly. GreenShift will continue to monitor this situation as new data becomes available."
    ];
};

const generateBodyContent = (category, topic, excerpt) => {
    return [
        excerpt,
        `The Context of ${topic}`,
        `Recent data indicates that ${topic} is becoming a central issue for ${category} experts. The trends observed over the last quarter suggest a significant acceleration, prompting calls for immediate regulatory and industrial responses. We are seeing a convergence of multiple factors: rising public awareness, stricter government mandates, and technological breakthroughs that are finally making sustainable alternatives cost-competitive.`,
        "Historical Precedents",
        `To understand the current trajectory of ${topic}, we must look back at similar shifts in the ${category} sector. Previous transitions—such as the move away from ozone-depleting substances or the initial adoption of renewable energy standards—followed a predictable S-curve of adoption. Early skepticism gave way to rapid institutional uptake once the economic case was proven. We are currently at the knee of that curve.`,
        "Systemic Implications",
        "Analysts warn that this is not an isolated phenomenon. The interplay between local environmental changes and global systems means that the impact of this event could ripple across borders. Verified sources from the IPCC and major monitoring agencies have flagged similar patterns in related sectors. For example, supply chain disruptions in one region are now causing price volatility in markets halfway across the globe, illustrating the fragility of our interconnected economy.",
        "Economic Impact Assessment",
        `The financial implications of ${topic} are staggering. Major insurance firms and investment banks are already adjusting their risk models to account for this new reality. Assets that were once considered safe bets are becoming stranded, while capital flows are increasingly redirected toward resilience and adaptation. This capital reallocation is driving innovation but also creating short-term market instability as incumbents struggle to pivot.`,
        "Technological and Policy Response",
        "In response to these developments, stakeholders are mobilizing resources to address the root causes. New frameworks are being proposed to mitigate risks, focusing on long-term sustainability rather than short-term fixes. The emphasis is shifting towards resilience and adaptation strategies. Governments are deploying subsidies and tax incentives to accelerate the transition, while the private sector is ramping up R&D spending to solve critical bottlenecks.",
        "Expert Consensus",
        `Leading voices in ${category} agree that the time for incrementalism has passed. The consensus emerging from recent summits is that structural reform is necessary to address the scale of the challenge presented by ${topic}. Disagreement remains on the speed of implementation, but the direction of travel is no longer in dispute.`,
        "Future Outlook",
        `As we look towards 2030, the trajectory of ${topic} will likely define the broader ${category} landscape. GreenShift will continue to monitor the data streams and provide updates as the situation evolves. The consensus among the scientific community remains clear: the window for effective action is narrowing, but the solutions are within reach. The decisions made in the next 18 months will likely determine the outcome for the next decade.`
    ];
};

const getRandomReadTime = () => {
    const min = 3;
    const max = 6;
    return `${Math.floor(Math.random() * (max - min + 1) + min)} min read`;
};

const createArticle = (id, title, category, topic, excerpt, date, imageUrl) => ({
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

const newsArticles = [
    // --- 1. CLIMATE CHANGE ---
    createArticle('cc-1', "Global Temp Hits 1.5°C for 12 Consecutive Months", 'Science', 'Climate Change', "For the first time in history, the 12-month global average has exceeded the Paris Agreement limit.", "Jan 2026", "https://images.unsplash.com/photo-1605021950274-13dfd2d3a042?q=80&w=2070"), // Heat sun
    createArticle('cc-2', "Antarctic Heatwave: 30°C Above Normal", 'Science', 'Climate Change', "Unprecedented temperatures in East Antarctica are rewriting climate models.", "Feb 2026", "https://images.unsplash.com/photo-1466629437334-b4f6603563c5?q=80&w=2078"), // Iceberg
    createArticle('cc-3', "The Carbon Budget is Officially Depleted", 'Science', 'Climate Change', "New analysis suggests we have crossed the threshold for 50% probability of staying under 1.5°C.", "Jan 2026", "https://images.unsplash.com/photo-1581061092797-849405625c56?q=80&w=2070"), // Industrial smoke
    createArticle('cc-4', "The Cost of Extreme Weather: $3 Trillion in 2025", 'Economy', 'Climate Change', "Reinsurers warn that large parts of the globe are becoming uninsurable.", "Dec 2025", "https://images.unsplash.com/photo-1619846205626-d66822c60803?q=80&w=2070"), // Storm flood
    createArticle('cc-5', "Methane Feedback Loops Detected in Siberia", 'Science', 'Climate Change', "Exploding permafrost craters are releasing ancient methane caches.", "Feb 2026", "https://images.unsplash.com/photo-1542385638-31627c2e366e?q=80&w=2070"), // Tundra
    createArticle('cc-6', "Attribution Science: Naming the Hurricane", 'Science', 'Climate Change', "Scientists can now calculate exactly how much climate change intensified a specific storm.", "Jan 2026", "https://images.unsplash.com/photo-1517502126227-2e212903c72b?q=80&w=2070"), // Hurricane space
    createArticle('cc-7', "Global South Adaptation Fund Shortfall", 'Policy', 'Climate Change', "Developing nations demand fulfilled pledges at the latest summit.", "Dec 2025", "https://images.unsplash.com/photo-1534081333815-ae5019106622?q=80&w=2070"), // Dry cracked earth
    createArticle('cc-8', "Jet Stream Instability: Why Winter is Weird", 'Science', 'Climate Change', "A weakening polar vortex is causing chaotic weather patterns in the Northern Hemisphere.", "Feb 2026", "https://images.unsplash.com/photo-1620608677028-5ae0075d9703?q=80&w=2070"), // Weather map
    createArticle('cc-9', "Ocean Circulation Slowdown Confirmed", 'Science', 'Climate Change', "Sensors in the Atlantic confirm the AMOC is at its weakest in a millennium.", "Jan 2026", "https://images.unsplash.com/photo-1506452305024-9d3f02d1c9b5?q=80&w=2070"), // Ocean waves
    createArticle('cc-10', "Urban Heat Islands: Cities are 10°C Hotter", 'Science', 'Climate Change', "New thermal mapping exposes the deadly impact of concrete over greenery.", "Dec 2025", "https://images.unsplash.com/photo-1449824913929-49aa7149c432?q=80&w=2070"), // City aerial

    // --- 2. ENERGY ---
    createArticle('en-1', "Perovskite Solar Record: 35% Efficiency", 'Innovation', 'Energy', "A breakthrough in tandem solar cells makes panels cheaper and more powerful.", "Feb 2026", "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2070"), // Solar panels
    createArticle('en-2', "Fusion Power: Commercial Pilot Announced", 'Innovation', 'Energy', "Following net energy gain, the first commercial fusion plant breaks ground in France.", "Jan 2026", "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070"), // Science reactor abstract
    createArticle('en-3', "Iron-Air Batteries Scale Up", 'Innovation', 'Energy', "Rust-based batteries are solving the grid storage problem for days, not hours.", "Jan 2026", "https://images.unsplash.com/photo-1513258496098-31a3d06f71d5?q=80&w=2070"), // Power grid
    createArticle('en-4', "Offshore Wind: Floating Turbines Go Deep", 'Innovation', 'Energy', "New floating tech unlocks wind energy in deep waters previously inaccessible.", "Feb 2026", "https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=2070"), // Wind turbines
    createArticle('en-5', "Geothermal: The Superhot Rock Revolution", 'Innovation', 'Energy', "Deep drilling allows geothermal energy to be accessed anywhere, not just volcanic zones.", "Dec 2025", "https://images.unsplash.com/photo-1518737380183-500e2b02a281?q=80&w=2070"), // Geothermal steam
    createArticle('en-6', "Global Coal Peak: It Happened in 2025", 'Economy', 'Energy', "IEA confirms coal consumption has entered structural decline.", "Jan 2026", "https://images.unsplash.com/photo-1595116701239-0d859599525c?q=80&w=2070"), // Coal pile
    createArticle('en-7', "Hydrogen Transport: Heavy Trucking shifts", 'Innovation', 'Energy', "Green hydrogen infrastructure is finally ready for long-haul logistics.", "Feb 2026", "https://images.unsplash.com/photo-1592833159057-65a2845730bd?q=80&w=2070"), // Truck abstract
    createArticle('en-8', "Solid State Batteries: EV Range Doubled", 'Innovation', 'Energy', "Toyota and VW release first mass-market cars with 1000km range.", "Jan 2026", "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=2070"), // EV charging
    createArticle('en-9', "Small Modular Reactors (SMRs) Go Online", 'Innovation', 'Energy', "Factory-built nuclear reactors begin powering remote communities.", "Dec 2025", "https://images.unsplash.com/photo-1587784318721-026852e6978c?q=80&w=2070"), // Nuclear cooling tower
    createArticle('en-10', "Virtual Power Plants Stabilize the Grid", 'Action', 'Energy', "Home batteries networked together saved California from blackouts this winter.", "Feb 2026", "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?q=80&w=2070"), // Smart home grid

    // --- 3. POLLUTION ---
    createArticle('pol-1', "Global Plastics Treaty Signed", 'Policy', 'Pollution', "Legally binding caps on plastic production come into force.", "Jan 2026", "https://images.unsplash.com/photo-1526951521990-620dc14c2103?q=80&w=2070"), // Plastic waste
    createArticle('pol-2', "PFAS Total Ban: The End of Teflon", 'Policy', 'Pollution', "EU and US regulators agree on a complete phase-out of forever chemicals.", "Feb 2026", "https://images.unsplash.com/photo-1622323758558-8d76813155cc?q=80&w=2070"), // Lab test tubes
    createArticle('pol-3', "Microplastics Found in Human Hearts", 'Science', 'Pollution', "New medical study confirms plastic particles are crossing biological barriers.", "Dec 2025", "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=2070"), // Microscope abstract
    createArticle('pol-4', "E-Waste Recycling Hits 90% in Nordic Nations", 'Policy', 'Pollution', "Strict deposit schemes prove that circular electronics are possible.", "Jan 2026", "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=2070"), // E-waste
    createArticle('pol-5', "Ocean Cleanup: System 03 Success", 'Innovation', 'Pollution', "The Great Pacific Garbage Patch is shrinking for the first time.", "Feb 2026", "https://images.unsplash.com/photo-1621451537029-4c2f2c7a6e14?q=80&w=2070"), // Ocean plastic
    createArticle('pol-6', "Nitrogen Crisis: Farming Runoff Rules", 'Policy', 'Pollution', "New legislation targets algal blooms by capping fertilizer use.", "Jan 2026", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2070"), // Algae/Water
    createArticle('pol-7', "Air Quality AI: Street-Level Monitoring", 'Innovation', 'Pollution', "Hyper-local sensors reveal inequality in urban smog exposure.", "Dec 2025", "https://images.unsplash.com/photo-1596464528169-a1b72dc7d94f?q=80&w=2070"), // Smog city
    createArticle('pol-8', "Right to Repair Electronics Act", 'Policy', 'Pollution', "Manufacturers must now provide parts and manuals for 10 years.", "Feb 2026", "https://images.unsplash.com/photo-1581092921461-eab62e97a782?q=80&w=2070"), // Repair electronics
    createArticle('pol-9', "Chemical Fertilizer Tax Implemented", 'Economy', 'Pollution', "Incentivizing regenerative agriculture through fiscal policy.", "Jan 2026", "https://images.unsplash.com/photo-1625246333195-55197c371797?q=80&w=2070"), // Farm field
    createArticle('pol-10', "Space Debris Removal Mission Launches", 'Innovation', 'Pollution', "First commercial satellite capture successfully demonstrates orbit cleanup.", "Feb 2026", "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2070"), // Satellite space

    // --- 4. POLICY & ECONOMICS ---
    createArticle('pe-1', "Carbon Border Tax (CBAM) Global Rollout", 'Policy', 'Policy & Economics', "Imports to the EU and UK now face levies based on their carbon footprint.", "Jan 2026", "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2070"), // Shipping containers
    createArticle('pe-2', "Beyond GDP: Adopting Green Ecosystem Product", 'Economy', 'Policy & Economics', "Five nations replace GDP with GEP to measure true economic health.", "Feb 2026", "https://images.unsplash.com/photo-1526304640152-d4619684e484?q=80&w=2070"), // Economy graph
    createArticle('pe-3', "Fossil Fuel Divestment Hits $50 Trillion", 'Economy', 'Policy & Economics', "Pension funds continue the mass exodus from oil and gas assets.", "Dec 2025", "https://images.unsplash.com/photo-1611974765270-ca12586343bb?q=80&w=2070"), // Stock market
    createArticle('pe-4', "Ecocide Law Recognized by ICC", 'Policy', 'Policy & Economics', "Destruction of ecosystems can now be prosecuted as a crime against humanity.", "Jan 2026", "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2070"), // Gavel
    createArticle('pe-5', "Climate Migration Visas Established", 'Policy', 'Policy & Economics', "New Zealand creates legal pathway for Pacific islanders displaced by sea level rise.", "Feb 2026", "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070"), // Island coast
    createArticle('pe-6', "Corporate Liability: CEOs Sued Personally", 'Policy', 'Policy & Economics', "Landmark ruling holds directors accountable for climate risk negligence.", "Jan 2026", "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2070"), // Business suit
    createArticle('pe-7', "Subsidies Shift: From Fossil to Green", 'Economy', 'Policy & Economics', "G20 nations agree to redirect $500B in oil subsidies to renewables.", "Dec 2025", "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2070"), // Wind turbine graph
    createArticle('pe-8', "Circular Economy Act Enforced", 'Policy', 'Policy & Economics', "Mandatory recycling and durability standards for all consumer goods.", "Jan 2026", "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070"), // Recycling symbol
    createArticle('pe-9', "Just Transition Fund Operational", 'Policy', 'Policy & Economics', "Billions allocated to retrain coal workers for the clean energy sector.", "Jan 2026", "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070"), // Industry worker
    createArticle('pe-10', "Insurance Market Retreat", 'Economy', 'Policy & Economics', "Major insurers pull coverage from coastal zones, triggering real estate shock.", "Feb 2026", "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070"), // House flooded

    // --- 5. OCEANS ---
    createArticle('oc-1', "High Seas Treaty Ratified", 'Policy', 'Oceans', "Protection now extends to international waters, covering 60% of the ocean.", "Jan 2026", "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070"), // Open ocean
    createArticle('oc-2', "Deep Sea Mining Moratorium", 'Policy', 'Oceans', "Nations vote to pause seabed mining until environmental impacts are understood.", "Feb 2026", "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070"), // Deep sea abstract
    createArticle('oc-3', "Coral Reef 3D Printing Success", 'Science', 'Oceans', "Artificial structures are successfully hosting new polyps in the Great Barrier Reef.", "Dec 2025", "https://images.unsplash.com/photo-1546026423-cc4642628d2b?q=80&w=2070"), // Coral reef
    createArticle('oc-4', "Seagrass Restoration Scales Up", 'Conservation', 'Oceans', "Robotic planting of seagrass meadows to capture blue carbon.", "Jan 2026", "https://images.unsplash.com/photo-1583212235753-325f32726478?q=80&w=2070"), // Underwater grass
    createArticle('oc-5', "Arctic Ocean Acidification Alert", 'Science', 'Oceans', "pH levels in the north are dropping faster than anywhere else on Earth.", "Feb 2026", "https://images.unsplash.com/photo-1517627043994-b991abb62fc8?q=80&w=2070"), // Arctic water
    createArticle('oc-6', "Whale Carbon Credits Launched", 'Economy', 'Oceans', "Financial market now values whales for their carbon sequestration role.", "Jan 2026", "https://images.unsplash.com/photo-1568430462989-44163eb1752f?q=80&w=2070"), // Whale tail
    createArticle('oc-7', "Sustainable Fisheries Tech", 'Innovation', 'Oceans', "AI cameras on nets reduce bycatch by 95% in commercial fleets.", "Dec 2025", "https://images.unsplash.com/photo-1534961880437-ce5ae2033053?q=80&w=2070"), // Fishing boat
    createArticle('oc-8', "Ocean Thermal Energy Conversion", 'Innovation', 'Oceans', "OTEC plant in Hawaii proves viability of temperature-gradient power.", "Feb 2026", "https://images.unsplash.com/photo-1478359846550-dd66e74661bf?q=80&w=2070"), // Ocean waves horizon
    createArticle('oc-9', "Plastic Free Coastlines Initiative", 'Action', 'Oceans', "Global volunteer network clears record tonnage from beaches.", "Jan 2026", "https://images.unsplash.com/photo-1618477461853-5f8dd68aa395?q=80&w=2070"), // Beach clean
    createArticle('oc-10', "Marine Protected Areas Hit 30%", 'Conservation', 'Oceans', "The world achieves the 30x30 target for ocean conservation early.", "Dec 2025", "https://images.unsplash.com/photo-1582967788606-a171f1080cae?q=80&w=2070"), // School of fish

    // --- 6. BIODIVERSITY ---
    createArticle('bio-1', "30x30 Target Met on Land", 'Policy', 'Biodiversity', "30% of global land is now under protection status.", "Jan 2026", "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2070"), // Green forest aerial
    createArticle('bio-2', "De-Extinction: Mammoth Genes Edited", 'Science', 'Biodiversity', "Colossal Biosciences creates first viable mammoth hybrid embryo.", "Feb 2026", "https://images.unsplash.com/photo-1551009175-8a68da93d5f9?q=80&w=2070"), // Elephant
    createArticle('bio-3', "Indigenous Guardianship Programs", 'Policy', 'Biodiversity', "Returning land management rights to indigenous groups boosts biodiversity.", "Dec 2025", "https://images.unsplash.com/photo-1533241242330-d309bc087f98?q=80&w=2070"), // Nature person
    createArticle('bio-4', "Pollinator Recovery Plan", 'Conservation', 'Biodiversity', "Banning neonics leads to bounce back in wild bee populations.", "Jan 2026", "https://images.unsplash.com/photo-1508556497405-ed7dcd94acfc?q=80&w=2070"), // Bee
    createArticle('bio-5', "Invasive Species AI Monitoring", 'Innovation', 'Biodiversity', "Autonomous drones identify and map invasive plants in real-time.", "Feb 2026", "https://images.unsplash.com/photo-1463852247062-1bbca38f7805?q=80&w=2070"), // Drone forest
    createArticle('bio-6', "Soil Microbiome Mapping", 'Science', 'Biodiversity', "Global census of soil bacteria reveals the hidden web of life.", "Jan 2026", "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2070"), // Plant sprout soil
    createArticle('bio-7', "Wildlife Corridors Connect Continents", 'Conservation', 'Biodiversity', "New 'Highway for Nature' links national parks across borders.", "Dec 2025", "https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=2070"), // Landscape
    createArticle('bio-8', "Amazon Tipping Point Averted?", 'Science', 'Biodiversity', "Deforestation rates drop to near zero, giving the rainforest a chance.", "Feb 2026", "https://images.unsplash.com/photo-1591800057864-168a18414605?q=80&w=2070"), // Amazon aerial
    createArticle('bio-9', "Global Seed Vault Expansion", 'Conservation', 'Biodiversity', "Svalbard receives largest ever deposit of crop varieties.", "Jan 2026", "https://images.unsplash.com/photo-1530263503756-b389f76e3305?q=80&w=2070"), // Svalbard
    createArticle('bio-10', "Rewilding Europe: The Bison Return", 'Conservation', 'Biodiversity', "Herds of wild bison roam the UK and Germany for the first time in centuries.", "Dec 2025", "https://images.unsplash.com/photo-1504217051514-96afa06398be?q=80&w=2070"), // Bison

    // --- 7. CONSERVATION ---
    createArticle('con-1', "Congo Basin Protection Deal", 'Policy', 'Conservation', "Historic agreement to preserve the world's second lung.", "Jan 2026", "https://images.unsplash.com/photo-1470058869958-2a77ade41c02?q=80&w=2070"), // Jungle river
    createArticle('con-2', "Wetland Credits Market Booms", 'Economy', 'Conservation', "Financial incentives drive massive peatland restoration.", "Feb 2026", "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070"), // Wetland
    createArticle('con-3', "Anti-Poaching Drones Success", 'Innovation', 'Conservation', "Thermal imaging drones reduce Rhino poaching to zero in key parks.", "Dec 2025", "https://images.unsplash.com/photo-1535083783855-76ae62b2914e?q=80&w=2070"), // Rhino
    createArticle('con-4', "River Rights Movement", 'Policy', 'Conservation', "More rivers granted legal personhood status in South America.", "Jan 2026", "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=2070"), // River
    createArticle('con-5', "Forest Stewardship Council 2.0", 'Policy', 'Conservation', "Stricter standards for sustainable timber eradicate loopholes.", "Feb 2026", "https://images.unsplash.com/photo-1448375240586-dfd8d395ea6c?q=80&w=2070"), // Forest lumber
    createArticle('con-6', "Desert Greening Projects", 'Innovation', 'Conservation', "Great Green Wall in Africa shows visible progress from space.", "Jan 2026", "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=2070"), // Desert plant
    createArticle('con-7', "Urban Nature Reserves", 'Action', 'Conservation', "Cities converting golf courses into public wildlands.", "Dec 2025", "https://images.unsplash.com/photo-1596356453261-0d265ae2520a?q=80&w=2070"), // Park city
    createArticle('con-8', "National Parks Digital Twin", 'Innovation', 'Conservation', "VR tourism generates revenue for parks without the foot traffic.", "Feb 2026", "https://images.unsplash.com/photo-1519331379826-f9478558d196?q=80&w=2070"), // VR nature
    createArticle('con-9', "Community Conservation Fund", 'Action', 'Conservation', "Crowdfunding buys huge tracts of Patagonian wilderness.", "Jan 2026", "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070"), // Mountains
    createArticle('con-10', "Endangered Species Recovery", 'Science', 'Conservation', "Tiger numbers double in Nepal thanks to habitat corridors.", "Dec 2025", "https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=2070"), // Tiger

    // --- 8. SOLUTIONS ---
    createArticle('sol-1', "Direct Air Capture Hubs Online", 'Innovation', 'Solutions', "Massive carbon sucking plants in Texas and Iceland begin operations.", "Jan 2026", "https://images.unsplash.com/photo-1569834223296-6d63653b6c4b?q=80&w=2070"), // Industrial plant
    createArticle('sol-2', "Lab-Grown Meat Price Parity", 'Economy', 'Solutions', "Cultivated chicken is now cheaper than farmed chicken in Singapore.", "Feb 2026", "https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=2070"), // Lab petri dish
    createArticle('sol-3', "15-Minute Cities Success", 'Policy', 'Solutions', "Paris report shows 40% drop in car traffic and improved mental health.", "Dec 2025", "https://images.unsplash.com/photo-1517586979036-c7f1e72e3895?q=80&w=2070"), // Biking city
    createArticle('sol-4', "Hempcrete Construction Boom", 'Innovation', 'Solutions', "Carbon-negative building materials gain mainstream adoption.", "Jan 2026", "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2070"), // Construction
    createArticle('sol-5', "Algae Bioplastics", 'Innovation', 'Solutions', "Seaweed-based packaging replaces single-use plastics in major supermarkets.", "Feb 2026", "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?q=80&w=2070"), // Seaweed
    createArticle('sol-6', "Passive Cooling Architecture", 'Innovation', 'Solutions', "Ancient techniques revived to cool buildings without AC.", "Jan 2026", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070"), // Modern architecture
    createArticle('sol-7', "Precision Agriculture AI", 'Innovation', 'Solutions', "Robots reduce herbicide use by 90% through spot-spraying.", "Dec 2025", "https://images.unsplash.com/photo-1625246333195-55197c371797?q=80&w=2070"), // Farm drone
    createArticle('sol-8', "Desalination Solar Tech", 'Innovation', 'Solutions', "New zero-brine solar domes provide water for arid regions.", "Feb 2026", "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070"), // Water plant
    createArticle('sol-9', "Circular Fashion Industry", 'Economy', 'Solutions', "Resale market overtakes fast fashion for the first time.", "Jan 2026", "https://images.unsplash.com/photo-1520986606214-8b456906c813?q=80&w=2070"), // Clothes rack
    createArticle('sol-10', "Carbon Negative Concrete", 'Innovation', 'Solutions', "New cement recipe absorbs CO2 as it cures.", "Feb 2026", "https://images.unsplash.com/photo-1518709414768-a88981a4515d?q=80&w=2070"), // Concrete
];

console.log(JSON.stringify(newsArticles, null, 2));
