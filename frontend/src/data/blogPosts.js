const blogPosts = [
  {
    id: "1",
    title: "The Art of First Flush: Darjeeling's Most Coveted Season",
    excerpt:
      "Each spring, between late March and mid-April, the fog-wrapped gardens of Darjeeling produce a harvest of such singular delicacy that connoisseurs around the world clear their calendars. We travel to the source every year — and the magic never fades.",
    content:
      "The Darjeeling district sits at elevations between 600 and 2,100 metres in the foothills of the Himalayas. When winter's chill lifts and the first warmth creeps in, the dormant tea bushes awaken with an almost urgent vitality. The buds that emerge in these early weeks — still tender, still touched by morning frost — carry a complexity that later flushes simply cannot replicate. The liquor is pale gold, almost green, with a haunting muscatel character: a naturally occurring grape-like quality born of a tiny leafhopper insect that nibbles the leaves during dry spells, triggering a remarkable enzymatic response.\n\nAt Swadistchai, we work directly with two estate families in Kurseong — the Singell estate and a small organic plot at Badamtam — who have been farming these hillsides for over 120 years. Our master blender Arjun Mehta cups each lot three times before a single kilogram is accepted. Roughly 60% of what we try is declined. The standard is absolute.\n\nFirst Flush teas are best brewed at 85°C for two to three minutes in a warmed porcelain or glass vessel. Use soft water wherever possible — hard water mutes the delicate aromatics that make this tea exceptional. Add no milk, no sugar. Let the pale gold speak for itself.",
    date: "April 5, 2026",
    author: "Arjun Mehta",
    category: "Origin Stories",
    /* Misty tea estate — Darjeeling first flush */
    image:
      "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=800&h=500&q=80&auto=format&fit=crop",
    readTime: 8,
    featured: true,
    tags: ["Darjeeling", "First Flush", "India", "Seasonality"],
  },
  {
    id: "2",
    title: "How to Brew the Perfect Cup of Assam Tea",
    excerpt:
      "Assam black tea is the backbone of India's tea culture — bold, malty, deeply comforting. But 'bold' does not mean 'forgiving'. The difference between a transcendent Assam and a bitter one lies in three variables: temperature, time, and the quality of the leaf itself.",
    content:
      "The Brahmaputra valley of Upper Assam is unlike anywhere else on earth. Rich alluvial flood plains, high humidity, and strong summer sunlight produce a tea of enormous body — one that can carry milk without losing its identity, and stand alone as a meditation in malt and muscular warmth. Our estate partner in Jorhat, whose family has worked the same land for four generations, produces TGFOP-grade orthodox leaves that bear no resemblance to the fannings stuffed into commercial teabags.\n\nThe golden rule for Assam: never use boiling water. Freshly boiled water at 95°C is ideal. Steep for three to four minutes maximum. Orthodox Assam is forgiving on time compared to Japanese greens, but push past five minutes and bitterness arrives uninvited. For milk drinkers, add a small pour of full-fat dairy after steeping — Assam's tannins bind beautifully with milk proteins to create that characteristic brisk, satisfying finish that has anchored Indian mornings for generations.",
    date: "March 28, 2026",
    author: "Priya Nair",
    category: "Tea Culture",
    /* Tea ceremony setup — Assam estate atmosphere */
    image:
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&h=500&q=80&auto=format&fit=crop",
    readTime: 7,
    featured: false,
    tags: ["Assam", "Black Tea", "Brewing", "Chai"],
  },
  {
    id: "3",
    title: "Matcha vs Sencha: Understanding Japanese Green Teas",
    excerpt:
      "Both are green, both are Japanese, and both come from the same Camellia sinensis plant. But matcha and sencha are as different as oil paint and watercolour — similar ingredients, entirely different experience.",
    content:
      "Sencha is Japan's most consumed tea — a steamed, rolled, and dried whole-leaf green tea that brews into a bright jade infusion with grassy, vegetal notes and a clean, brisk finish. The leaves are grown in full sun, which maximises catechin production and gives sencha its characteristic astringency balanced by natural sweetness.\n\nMatcha takes a radically different path. Three to four weeks before harvest, the bushes destined for matcha are shaded from direct sunlight. This triggers a surge in chlorophyll and L-theanine production, deepening the green colour and amplifying umami depth. After harvest, the leaves are dried flat as tencha, then the veins and stems are removed. What remains is stone-ground to order into a fine, vivid powder of extraordinary concentration.",
    date: "March 15, 2026",
    author: "Takashi Mori",
    category: "Education",
    /* Matcha bowl — ceremonial grade */
    image:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=500&q=80&auto=format&fit=crop",
    readTime: 6,
    featured: false,
    tags: ["Matcha", "Sencha", "Japan", "Green Tea"],
  },
  {
    id: "4",
    title: "The Health Benefits of White Tea: Science and Tradition",
    excerpt:
      "White tea is the least processed, most gently handled of all tea types. For centuries, Chinese physicians valued it above all others. Modern science is now catching up — and the findings are remarkable.",
    content:
      "White tea is harvested from the youngest, most tender buds and leaves of the Camellia sinensis plant — typically only in the early spring, and only when the buds still carry their fine silver hairs. The processing is minimal by design: a brief withering under shade, then slow drying in mountain air. No rolling, no oxidation, no pan-firing. The result is a tea that preserves more of the plant's original compounds than any other category.\n\nScientific studies have identified several notable health associations. White tea contains some of the highest concentrations of EGCG — epigallocatechin gallate — a potent antioxidant linked to reduced cardiovascular risk, improved skin elasticity, and anti-inflammatory action.",
    date: "March 8, 2026",
    author: "Dr. Priya Chandran",
    category: "Wellness",
    /* White tea pour — delicate infusion */
    image:
      "https://images.unsplash.com/photo-1492778297155-7be4c83a4422?w=800&h=500&q=80&auto=format&fit=crop",
    readTime: 7,
    featured: false,
    tags: ["White Tea", "Health", "Antioxidants", "Wellness"],
  },
  {
    id: "5",
    title: "Tea Terroir: Why Your Tea Tastes Like Its Landscape",
    excerpt:
      "Wine lovers have long understood terroir — the way soil, altitude, rainfall and microclimate shape what ends up in the glass. Tea carries the same truth, arguably more dramatically.",
    content:
      "Terroir is a French word that has no precise English equivalent. It refers to the complete natural environment in which a food or drink is produced — the soil composition, altitude, rainfall patterns, temperature variation, microbial activity, and the specific cultivars that have adapted to all of the above over generations. Every cup of quality single-origin tea is, in essence, a liquid map of its origin.\n\nDarjeeling tea owes its famous muscatel character partly to altitude (the thinner air stresses the plant, concentrating flavour compounds), partly to its unique green-leaf variety Camellia sinensis var. assamica hybridised with Chinese varieties, and partly to a tiny leafhopper insect that creates micro-wounds prompting defensive enzymatic reactions in the leaf.",
    date: "February 22, 2026",
    author: "Arjun Mehta",
    category: "Tea Culture",
    /* Silver needle buds — Fujian white tea terroir */
    image:
      "https://images.unsplash.com/photo-1519817914152-22d216bb9170?w=800&h=500&q=80&auto=format&fit=crop",
    readTime: 8,
    featured: false,
    tags: ["Terroir", "India", "Origins", "Flavour"],
  },
  {
    id: "6",
    title: "The Ancient Tea Horse Road: China's Most Historic Trade Route",
    excerpt:
      "Long before the Silk Road achieved its fame, a more physically treacherous route connected Yunnan's tea gardens to the markets of Tibet and beyond. The teas that survived the journey changed permanently in transit — and became a category unto themselves.",
    content:
      "The Ancient Tea Horse Road — called Cha Ma Gu Dao in Chinese — stretched from Yunnan province through Tibet to India, Bhutan, and Nepal. The route ascended and descended passes of 4,000 metres or higher, endured monsoon rains, altitude sickness, and banditry. It was used from roughly the 7th century Tang dynasty through to the mid-20th century, carrying compressed tea bricks from Yunnan in exchange for Tibetan war horses.\n\nThe teas that travelled this road were pressed into dense bricks for efficient transport. During the weeks and months in transit, the teas underwent a slow, natural fermentation. The green raw leaves darkened. Earthy, complex, deeply savoury notes emerged. This is the origin of Pu-erh — the only tea category that genuinely improves with age.",
    date: "February 14, 2026",
    author: "Mei Lin",
    category: "Origin Stories",
    /* Misty mountain landscape — ancient trade route atmosphere */
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=500&q=80&auto=format&fit=crop",
    readTime: 9,
    featured: false,
    tags: ["Pu-erh", "China", "History", "Yunnan"],
  },

  /* ── Recipes ── */
  {
    id: "7",
    title: "Masala Chai Spice Blend: The Authentic Indian Recipe",
    excerpt:
      "True masala chai is not a tea bag dunked in milky water. It is a slow-cooked alchemy of whole spices, robust Assam leaves, and full-fat milk — a ritual that fills the kitchen with the scent of cardamom and ginger every morning in millions of Indian homes.",
    content:
      "Our masala chai blend starts with a robust CTC Assam as the base — the biscuit-malt backbone that holds the spices in place. To 500ml of cold water we add one heaped teaspoon of our Assam CTC leaves, 4 green cardamom pods (lightly cracked), a 2cm stick of true Ceylon cinnamon, 3 black peppercorns, a quarter teaspoon of freshly grated ginger, and one clove. Bring everything to a gentle simmer for three minutes before adding 150ml of full-fat milk. Let it all return to the boil, reduce to the lowest heat, and simmer for another two to three minutes — stirring gently — until the colour deepens to a rich amber-tan.\n\nStrain into a clay or ceramic cup. Add unrefined cane sugar (jaggery is ideal) to taste. The clay cup is not optional if you can help it — it breathes with the chai in a way no other material does, rounding the edges of the spice and releasing an earthy minerality that completes the experience.\n\nFor an elevated version, add a pinch of freshly ground star anise and a very small scraping of nutmeg before straining. This is our Chai Reserve formula — the one we serve at our Breach Candy tasting room.",
    date: "April 2, 2026",
    author: "Priya Nair",
    category: "Recipes",
    /* Masala spices — chai ingredients */
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&h=500&q=80&auto=format&fit=crop",
    readTime: 6,
    featured: false,
    tags: ["Chai", "Recipes", "Spices", "Assam", "Indian Tea"],
  },
  {
    id: "8",
    title: "Matcha Latte & Five Green Tea Desserts to Try at Home",
    excerpt:
      "Ceremonial-grade matcha has moved well beyond the teacup. From cloud-soft matcha lattes to a silky matcha panna cotta that sets like jade, here are five ways to bring our Uji matcha into your kitchen — each one effortless, each one extraordinary.",
    content:
      "The Matcha Latte: Sift 2g of our Ceremonial Grade Uji Matcha into a pre-warmed bowl. Add 40ml of 70°C water and whisk briskly in a 'W' motion until you have a smooth, frothy paste with no lumps. Pour over 180ml of steamed oat or full-fat dairy milk. Sweeten with a drop of honey if desired. Do not use boiling water — it scorches the chlorophyll and turns the latte bitter and dull.\n\nMatcha Panna Cotta: Dissolve 1.5 tsp agar-agar in 400ml warm cream with 2 tbsp sugar. Whisk in 3g sifted matcha until smooth. Pour into moulds and chill for four hours. Unmould onto a cold plate and serve with a drizzle of yuzu honey.\n\nMatcha Ice Cream (no-churn): Whip 300ml double cream to soft peaks. Fold in a tin of condensed milk and 4g sifted matcha. Freeze for six hours minimum. The result is a vivid, intensely flavoured jade ice cream that rivals anything you will find in Kyoto.",
    date: "March 22, 2026",
    author: "Takashi Mori",
    category: "Recipes",
    /* Matcha ceremonial — vivid emerald */
    image:
      "https://images.unsplash.com/photo-1567922045116-2a00fae2ed03?w=800&h=500&q=80&auto=format&fit=crop",
    readTime: 7,
    featured: false,
    tags: ["Matcha", "Recipes", "Baking", "Latte", "Desserts"],
  },
  {
    id: "9",
    title: "Iced Hibiscus & Rose Tea Cooler — The Ultimate Summer Drink",
    excerpt:
      "When Rajasthan's summer heat arrives, our tasting room team reaches for this recipe every time: a deep crimson hibiscus cooler with a hint of rose, fresh lime, and a whisper of cardamom. Beautiful to look at. Even better to drink.",
    content:
      "Brew a strong pot of our Hibiscus Bloom blend — 3 heaped teaspoons per 500ml of freshly boiled water. Steep for 8 minutes (longer than usual) to extract maximum colour and tartness. Strain and allow to cool to room temperature. Do not refrigerate hot tea — it clouds the colour.\n\nTo assemble: fill a tall glass with ice. Pour in 150ml of the cooled hibiscus brew. Add a squeeze of fresh lime and a small splash of rose water (3–4ml is enough — rose water is powerful). Sweeten with agave or simple syrup to taste. Finish with a few fresh mint leaves pressed against the inside of the glass.\n\nFor a party pitcher: double or triple the recipe and stir in 2 tbsp of elderflower cordial. The floral layers are extraordinary. Garnish with dried hibiscus petals and rose buds for a display that looks as elegant as it tastes.",
    date: "March 10, 2026",
    author: "Nandita Iyer",
    category: "Recipes",
    /* Tea garden landscape — summer estate */
    image:
      "https://images.unsplash.com/photo-1566748963551-6f5b3fc0d5e1?w=800&h=500&q=80&auto=format&fit=crop",
    readTime: 5,
    featured: false,
    tags: ["Hibiscus", "Iced Tea", "Recipes", "Summer", "Cooler"],
  },

  /* ── Sustainability ── */
  {
    id: "10",
    title: "Our Rainforest Alliance Certified Gardens: What It Really Means",
    excerpt:
      "The Rainforest Alliance certification badge on our packaging is not marketing. Behind those three small frogs is a rigorous audit process, strict environmental requirements, and a genuine commitment to biodiversity that our garden partners take extremely seriously.",
    content:
      "Rainforest Alliance certification requires that farms meet the Sustainable Agriculture Standard — one of the most comprehensive agricultural auditing frameworks in the world. For our Darjeeling and Nilgiri partners, this means maintaining natural forest buffers around tea fields (a minimum 30-metre zone), eliminating synthetic pesticides from a prohibited list of over 200 compounds, and implementing integrated pest management that works with the ecosystem rather than against it.\n\nBiodiversity monitoring is ongoing: our Makaibari estate partner in Darjeeling employs a resident naturalist who surveys bird, butterfly, and mammal populations annually. Since achieving Rainforest Alliance certification in 2019, recorded bird species on the estate have increased from 47 to 71 — a direct result of converting the estate's buffer zones from monoculture to mixed native woodland.\n\nAt Swadistchai, we visit every certified partner estate at least once annually. We cup on-site, walk the fields, and meet the workers. Certification is the floor, not the ceiling. Our standard is higher still.",
    date: "February 28, 2026",
    author: "Arjun Mehta",
    category: "Sustainability",
    /* Tea garden rows — sustainability context */
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&q=80&auto=format&fit=crop",
    readTime: 7,
    featured: false,
    tags: ["Sustainability", "Certification", "Organic", "Biodiversity"],
  },
  {
    id: "11",
    title: "Zero-Waste Packaging: How We Eliminated Single-Use Plastic",
    excerpt:
      "In 2022 we made a commitment: by 2024, no single-use plastic in any Swadistchai shipment. We kept that promise — and the journey taught us that beautiful, sustainable packaging is not a compromise. It is a design opportunity.",
    content:
      "The challenge was not just replacing plastic. It was replacing it with materials that maintained our premium feel, protected the tea from light and moisture, and could be composted or recycled in an Indian household without requiring specialist facilities.\n\nOur solution came from three materials: unbleached FSC-certified kraft paper for outer boxes (printed with soy inks), wax-coated seed paper for inner pouches (which can be planted in a garden to grow wildflowers), and tin canisters with rubber gasket lids for our loose-leaf premium tins — sourced from a family-run tin workshop in Moradabad that has been serving the spice trade for 60 years.\n\nThe inner pouch was the hardest problem. Most biodegradable films are permeable to oxygen and moisture — catastrophic for whole-leaf tea. We worked with a material science team in Pune for 14 months before arriving at a cellulose-based film coated with beeswax emulsion: fully home-compostable, with moisture vapour transmission rates comparable to conventional metallised film.\n\nSince our packaging transition, we have eliminated an estimated 2.4 tonnes of virgin plastic per year from our supply chain.",
    date: "February 5, 2026",
    author: "Kavitha Rao",
    category: "Sustainability",
    /* Loose leaf tea — elegant presentation */
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=500&q=80&auto=format&fit=crop",
    readTime: 8,
    featured: false,
    tags: ["Sustainability", "Packaging", "Zero Waste", "Eco-Friendly"],
  },
  {
    id: "12",
    title: "Empowering Tea Farmers: Our Fair Trade Story",
    excerpt:
      "Fair Trade certification guarantees a minimum price floor and a community premium — but at Swadistchai, we have always paid above both. This is the story of why direct trade relationships, built on trust and transparency, deliver more than any certification alone.",
    content:
      "The conventional tea supply chain is long and extractive: from garden to broker to auction to importer to brand to retailer, each step takes a margin, and the farmer — who does the hardest, most skilled work — typically receives the smallest share. At the Makaibari estate in Kurseong, one of our primary partners, the family worked with us to restructure payments entirely: we buy directly, pay in advance of the season, and price each lot based on a cost-of-production model that ensures the estate's workers receive a living wage above the West Bengal statutory minimum.\n\nThe community premium — 15% above our direct purchase price — funds three initiatives: a girls' scholarship programme that has sent 34 young women from tea-picking families to university in the last six years; a micro-loan fund for workers who wish to start small businesses; and a primary healthcare clinic staffed by a resident nurse.\n\nIn the last three years, estate worker turnover has fallen from 22% to 4%. The quality of the tea we receive has improved measurably: when workers feel secure and valued, they take greater care. Every cup of our Makaibari First Flush is, in a real sense, the product of that security.",
    date: "January 20, 2026",
    author: "Arjun Mehta",
    category: "Sustainability",
    /* Estate garden path — farm to cup journey */
    image:
      "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=800&h=500&q=80&auto=format&fit=crop",
    readTime: 9,
    featured: false,
    tags: ["Fair Trade", "Sustainability", "Farmers", "Community", "Ethics"],
  },
];

export default blogPosts;
