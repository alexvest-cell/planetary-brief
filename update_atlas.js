import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config({ path: '.env.local' });

const oldTitles = [
  'Global Coral Heat Stress Has Been Uninterrupted Since 2018, Affecting 87% Of Reef Areas At Intensity 50% Above Prior Records',
  'Global Electricity Demand Reached 28,200 TWh In 2025 With Data Centre Growth Running At Four Times The System Average Rate',
  'Freshwater Systems Under Compound Pressure as Basin Scarcity and Hydrological Volatility Converge',
  'Global EV Sales Reached 20.7 Million In 2025 As Europe Grew 33% And North America Contracted For The First Time',
  'Solar And Wind Supplied 17.6% Of Global Electricity In The First Three Quarters Of 2025 As Renewables Virtually Matched Coal For The Full Year',
  'Global Sea Level Rose 0.08 cm In 2025 — 86% Below The 2024 Rate — As La Nina Temporarily Shifted Ocean Water To The Amazon Basin',
  'Mauna Loa CO2 Crossed 430 ppm For The First Time In May 2025 As The 2024 Annual Growth Rate Set An Instrumental Record',
  'Steel and Cement Face a Decade of Forced Technology Choices With No Room for Delay',
  'Sovereign Green Bond Issuance Reaches USD 695 Billion Cumulative As Q1 2025 Volume Contracts 33.8% Year On Year',
  'Adaptation Finance Flows at Roughly One-Twelfth of Estimated Developing-Country Needs',
  'Transmission Constraints Are Absorbing the Cost of the Renewable Buildout',
  'Offshore Wind Capacity Grows, But Grid Integration Constraints Threaten Delivery Against Net-Zero Benchmarks',
  'Global Ocean pH Has Declined 0.1 Units Since Pre-Industrial Levels, Monitoring Data Show Continued Acidification',
  'Judicial Decisions On Climate Accountability Reshape Regulatory And Disclosure Obligations Across Jurisdictions',
  'Global Methane Emissions Reach 582 Mt In 2025, IEA Tracker Shows 1% Decline From 2024',
  'EU CSRD Enforcement Begins As First Large Companies Enter Mandatory ESRS Reporting Phase',
  'Global Temperature Anomaly Averages 1.48°C Above 1850–1900 Baseline In 2025 Consolidated Datasets',
  'Global Fossil Fuel Production Plans Remain 110% Above 1.5°C Pathway, 2025 Assessments Show',
  'Carbon Markets Integrity Reform Tests Alignment With Net-Zero Pathways',
  'Critical Minerals Strategy Race Tests Alignment Between Industrial Policy And Net-Zero Pathways',
  'Food System Emissions 2025: Agriculture, Land Use And Policy Reform Pathways',
  'Climate Migration Risk Zones 2025: Emerging Displacement Patterns And Governance Preparedness',
  'Heat Risk In Megacities 2025: Urban Adaptation Planning And Policy Response Gaps',
  'Air Pollution Mortality Trends 2025: WHO Data Show Persistent PM2.5 Exposure Gaps',
  'Green Hydrogen Scaling 2025: Infrastructure Build-Out And Cost Trajectories Versus Net-Zero Scenarios',
  'Global Grid-Scale Battery Capacity Reaches 124 GW In 2024 As Annual Additions Rise Twelvefold Since 2019',
  'Direct Air Capture Deployment 2025: Scaling Trajectory Versus Modelled Net-Zero Pathways',
  'Biodiversity Finance Gap 2025: Can Current Global Pledges Close The Funding Shortfall?',
  '30x30 Target Implementation: Designing Protected Area Networks for Ecological Effectiveness',
  'The Fourth Global Coral Bleaching Event Has Now Affected 83.7% Of The World\'s Reefs',
  'Tropical Primary Forest Loss Hit A New Record Of 6.7 Million Hectares In 2024 As Fire Overtook Agriculture As The Leading Driver For The First Time',
  'Permafrost Carbon Feedback: Emerging Research Signals And Implications For Global Carbon Budgets',
  'Attribution Science In 2025: Linking Extreme Weather Events To Climate Change',
  'Arctic Sea Ice Set A Record Low Maximum In March 2025 While Annual Volume Hit Its Lowest Level On Record',
  'Planetary Health Check 2025 Confirms Seven Of Nine Earth System Boundaries Transgressed As Ocean Acidification Joins The Danger Zone',
  'ESG Reporting Rules Tighten: EU CSRD Implementation And Global Disclosure Convergence',
  'Loss And Damage Fund Operationalization: Institutional Architecture, Funding Sources, And Disbursement Mechanisms',
  'Carbon Pricing Covers 28% Of Global Emissions As Revenue Crosses $100 Billion And The EU CBAM Enters Its Definitive Phase',
  'Climate Finance Flows 2025: Public Versus Private Capital Trends And Allocation Gaps',
  'Nationally Determined Contributions 2025 Update Tracker: Ambition Gap And Implementation Signals',
  'Renewable Capacity Surpasses Fossil Growth In 2025: Structural Transition Or Statistical Effect?',
  'US And EU Methane Rules Tighten In 2025: Compliance Timelines And Energy Sector Implications',
  'Marine Heatwaves Intensify In 2025: Frequency, Duration And Ecological Risk Signals',
  'High Seas Treaty Implementation Phase: Governance Architecture And Marine Protection Pathways',
  'Fossil CO2 Hit A New Record In 2025 As The Remaining 1.5C Carbon Budget Shrinks To Four Years',
  'COP28 Aftermath: What The UAE Consensus Means For The Global Fossil Fuel Phase-Down',
  'Global Ocean Heat Content Rose 23 Zettajoules In 2025 — The Largest Annual Increase Since 2017 And A Ninth Consecutive Record'
];

const newTitles = [
  'Coral Heat Stress Has Persisted Since 2018 Across 87% Of Reefs',
  'Global Electricity Demand Reached 28,200 TWh In 2025',
  'Freshwater Systems Face Rising Basin Scarcity Risks',
  'Global EV Sales Reached 20.7 Million In 2025',
  'Solar And Wind Supplied 17.6% Of Global Power In 2025',
  'Global Sea Level Rose 0.08 cm In 2025',
  'Atmospheric CO₂ Surpassed 430 ppm At Mauna Loa',
  'Steel And Cement Face Forced Decarbonization Choices',
  'Sovereign Green Bonds Reach $695 Billion Issued',
  'Adaptation Finance Meets Only One-Twelfth Of Global Needs',
  'Transmission Bottlenecks Are Slowing Renewable Expansion',
  'Offshore Wind Expansion Faces Grid Integration Limits',
  'Ocean pH Has Fallen 0.1 Since Pre-Industrial Levels',
  'Climate Litigation Expands Corporate Disclosure Risk',
  'Global Methane Emissions Reach 582 Mt In 2025',
  'EU CSRD Enforcement Begins For Large Companies',
  'Global Temperature Averaged 1.48°C Above Pre-Industrial In 2025',
  'Fossil Fuel Production Plans Still 110% Above 1.5°C Pathway',
  'Carbon Market Integrity Reforms Accelerate',
  'Critical Minerals Race Tests Net-Zero Alignment',
  'Food Systems Remain A Major Source Of Global Emissions',
  'Climate Migration Risk Zones Expand In 2025',
  'Megacities Face Escalating Heat Risk',
  'PM2.5 Exposure Still Drives Global Air Pollution Deaths',
  'Green Hydrogen Scaling Faces Infrastructure Bottlenecks',
  'Global Grid Battery Capacity Reaches 124 GW',
  'Direct Air Capture Scaling Lags Net-Zero Pathways',
  'Global Biodiversity Finance Gap Remains Unclosed',
  '30x30 Target Implementation Expands Global Protected Areas',
  'Fourth Global Coral Bleaching Event Hits 83.7% Of Reefs',
  'Tropical Primary Forest Loss Hit 6.7M Hectares In 2024',
  'Permafrost Carbon Feedback Threatens Carbon Budgets',
  'Attribution Science Links Extreme Weather To Climate Change',
  'Arctic Sea Ice Maximum Hits Record Low In 2025',
  'Seven Of Nine Planetary Boundaries Now Exceeded',
  'ESG Reporting Tightens As EU CSRD Takes Effect',
  'Loss And Damage Fund Enters Operational Phase',
  'Carbon Pricing Now Covers 28% Of Global Emissions',
  'Climate Finance Flows Show Persistent Allocation Gaps',
  'NDC Updates Show Persistent Global Ambition Gap',
  'Renewables Growth Surpasses Fossil Capacity In 2025',
  'US And EU Methane Rules Tighten In 2025',
  'Marine Heatwaves Intensify In 2025 Monitoring Data',
  'High Seas Treaty Implementation Phase Begins',
  'Fossil CO₂ Hits Record As 1.5°C Carbon Budget Shrinks',
  'COP28 UAE Consensus Defines Fossil Fuel Phase-Down Path',
  'Ocean Heat Content Rose 23 ZJ In 2025, Ninth Record Year'
];

async function updateDB() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is empty. Check .env.local');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to Atlas');
    const db = mongoose.connection.db;
    let totalMatched = 0, totalModified = 0;
    
    for (let i = 0; i < oldTitles.length; i++) {
        const oldTitle = oldTitles[i];
        const newTitle = newTitles[i];
        
        try {
            const result = await db.collection('articles').updateOne(
                { title: oldTitle },
                { $set: { title: newTitle } }
            );
            totalMatched += result.matchedCount;
            totalModified += result.modifiedCount;
        } catch (e) {
            console.error('Failed to update title: ', oldTitle);
        }
    }
    
    console.log(`Finished. DB: Matched ${totalMatched}, Modified ${totalModified}`);
    
    // Also update local file just in case
    try {
        const localData = JSON.parse(fs.readFileSync('./server/local_articles.json', 'utf8'));
        let localUpdated = 0;
        
        localData.forEach(article => {
            const ix = oldTitles.indexOf(article.title);
            if(ix !== -1) {
                article.title = newTitles[ix];
                localUpdated++;
            }
        });
        
        fs.writeFileSync('./server/local_articles.json', JSON.stringify(localData, null, 2));
        console.log(`local_articles.json updated: ${localUpdated} items.`);
    } catch(e) {
        console.error('No local_articles.json or error updating it:', e.message);
    }
    
  } catch(err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

updateDB();
