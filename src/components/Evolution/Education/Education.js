export function education(evolution, alarms) {
  const alarm1 = alarms.alarm1.split(',').map(i => i.trim());

  let phrases = [
    'You have now completed the performance phase of this training evolution. ',
    'We will now proceed to the education phase. ',
    'Here are some tactical considerations to contemplate based on fire behavior, building construction, fire prevention codes and fire ground operations. ',
    'This is not meant to be a complete list. ',
    'These topics are designed to be thought provoking and create discussion. ',
    'Initial Radio Report/Primary Size-Up:',
    `${alarm1[0]} on scene of a ${evolution.size} ${evolution.height} ${
      evolution.occupancyType
    } with smoke and fire showing from the ${
      evolution.witnessedConditions
    } side. `,
    'Include in this section: Initial actions, needs, establishing command and a command post location. These are agency specific and these decisions should be based on standard operating procedures, staffing models and response matrices for your organization. ',
    'Secondary Size-Up:',
    `This is a typical ${
      evolution.construction
    } construction, with entry and egress points on ${
      evolution.entryEgress
    } sides. The survivability profile is ${
      evolution.survivabilityProfile
    } throughout the structure. `,
    'Location of the Fire:',
    `The fire appears to be a ${evolution.fireType} fire on the ${
      evolution.exhaustPath
    } side based on smoke & fire conditions. `
  ];

  if (evolution.flowpath === 'Uni-Directional') {
    phrases.push(
      `The flow path is Uni-directional with the exhaust on the ${
        evolution.exhaustPath
      } side. Uni-Directional is when the intake is from one opening and the exhaust is from a separate opening. If you control the airflow, you control the fire intensity. By using smoke indicators and fire conditions, control the flow path by managing vertical openings, doors and windows. These actions will limit fire growth, thus allowing longer offensive fire operations. `
    );
  } else {
    phrases.push(
      `The flow path is Bi-Directional with the exhaust path on the ${
        evolution.exhaustPath
      } side. Bi-Directional is where the intake and exhaust is from the same opening. Control the airflow controls the fires intensity. If you control the airflow, you control the fire intensity.  By using smoke indicators and fire conditions, control the flow path by managing vertical openings, doors and windows. These actions will limit fire growth, thus allowing longer offensive fire operations. `
    );
  }

  phrases.push(
    'Identify Flow Path:',
    'Volume, velocity, density and color are factors that will provide you with the information needed to predict the stability and growth potential of the fire. '
  );

  if (evolution.smoke === 'Black Laminar') {
    phrases.push(
      'Black laminar smoke can indicate a large contents fire with smoke traveling a long distance. The black color can indicate the presence of hydrocarbons and incomplete combustion.  Hydrocarbons are predominately found in finished wood and plastics found in the contents of a structure. Laminar effect can indicate the fire is in the incipient phase and has not reached its full potential or can also suggest smoke has been pushed from a distance. This information is valuable in the go, no-go decision-making process. '
    );
  } else if (evolution.smoke === 'Black Turbulent') {
    phrases.push(
      'Black turbulent smoke can indicate a large contents fire with the possibility of "rollover or flashover" "hi heat" involvement. In this case two components: color and velocity provide a great deal of information. The black color can indicate the presence of hydrocarbons and incomplete combustion.  Hydrocarbons are predominately found in finished wood and plastics from the contents of a room. Turbulence or velocity can indicate flashover. This information is valuable in the go, no-go decision-making process. '
    );
  } else if (evolution.smoke === 'Gray Laminar') {
    phrases.push(
      'Gray laminar smoke can indicate a contents fire with the possibility of smoke traveling a long distance and the fuel maybe outside its optimum flammable range. The fire may also be releasing moisture; it is possibly in the early stages of fire growth. In this case two components: color and velocity provide a great deal of information. The gray color can indicate that fire is off gassing the moisture contained in the fuel, but the fuel is not yet at optimum flammable range. Gray smoke can also indicate the presence of hydrocarbons and incomplete combustion. Laminar effect can indicate the fuel in the incipient phase of fire growth or can also suggest smoke has been pushed from a distance. This information is valuable in the go, no-go decision-making process. '
    );
  } else if (evolution.smoke === 'Gray Turbulent') {
    phrases.push(
      'Gray turbulent smoke can indicate a large contents fire with the possibility of "hi heat" involvement. In this case two components: color and velocity provide a great deal of information. The gray color can indicate the fire is off gassing the moisture contained in the fuel, but the fuel is not yet at optimum flammable range. Gray smoke can also indicate the presence of hydrocarbons and incomplete combustion. Turbulence or velocity can indicate flashover. This information is valuable in the go, no-go decision-making process. '
    );
  } else if (evolution.smoke === 'Brown Laminar') {
    phrases.push(
      'Brown laminar smoke can indicate fire has reached the structural members. In this case two components: color and velocity provide a great deal of information. The brown color can indicate the presence of sugars.  Sugar is predominately found in the unfinished wood found in the structural components. Laminar effect can indicate the unfinished wood has not reached optimum burning temperature or this effect can also suggest smoke has been pushed from a distance. This information is valuable in the go, no-go decision-making process. '
    );
  } else if (evolution.smoke === 'Brown Turbulent') {
    phrases.push(
      'Brown turbulent smoke can indicate fire has reached the structural members creating high heat. In this case two components: color and velocity provide a great deal of information. The brown color can indicate the presence of sugars.  Sugar is predominately found in the unfinished wood in structural members. Turbulence or velocity can indicate flashover. This information is valuable in the go, no-go decision-making process. '
    );
  }

  phrases.push(
    'Cool from a safe area:',
    'Cool the fire area from a protected location until the crews are in place.  This can be, but not limited to exterior water flow. There may be an opportunity to cool from multiple locations, including the interior of the structure. Reduce the heat release rate and decomposition of the contents within the structure by using cooling measures. ',
    'Extinguish the Fire:',
    'Based on smoke and fire conditions reset the fire if appropriate or extinguish the fire with a transitional or direct attack. ',
    'Transitional attack: Cool the fire from a safe location with a 10 to 20 second application of straight stream to the ceiling area. ',
    'Direct attack: Water applied directly to the seat of the fire.',
    'Rescue:',
    'Rescue is an operations requiring removal of human beings from an involved building or other hazardous situation and conveying them to a place of safety. ',
    'History reflects that firefighters are exposed to the greatest risk of injury and death during primary search and rescue operations. Search efforts must be based on the potential to save lives. ',
    'Salvage:',
    'Salvage operations require protecting buildings and contents from preventable damage due to fire, water or other elements. The use of salvage covers and plastic sheeting will reduce the fire loss. In some cases this is an after thought, but should be considered if time and resources exist. ',
    'Fire Prevention:'
  );

  if (
    evolution.category === 'Commercial Modern' ||
    evolution.category === 'Industrial Modern'
  ) {
    phrases.push(
      'Modern construction utilizes lightweight building materials. This construction style incorporates draft stops, fire partitions, and fire stops to limit fire travel. ',
      'This lightweight construction uses "Engineered Lumber" a term generally used to describe a wood structural member. This structural member is fabricated using bond fibers and materials that are pressed together to form a composite material used for joists and beams. ',
      'Engineered Lumber is a strong building component under normal conditions, but can lose its integrity rapidly under fire conditions.',
      'Building Construction:',
      'In modern buildings, the ceiling presents multiple tactical decision-making options.',
      'If convected heat is impeded by an enclosure and drywall from the lowest point, upward to the ceiling, the fire is contained as a room & contents fire. ',
      'Likewise, if the fire is in an unprotected attic, the fire is concealed as well, but will transition to a structure fire rapidly. ',
      'Higher heat release rate occurs because of the plume affect. Shorter buildings heat quicker, rapidly degrading building materials for advancement to collapse stage quickly. ',
      'In a fire that goes unimpeded from the floor to the ceiling the temperature will cool as it rises, reducing heat release rate. Conversely, if stopped by a ceiling the heat release rate is higher and grows more rapidly allowing for faster degrading of building materials. '
    );
  } else if (
    evolution.category === 'Commercial Legacy' ||
    evolution.category === 'Industrial Legacy'
  ) {
    phrases.push(
      'Legacy construction allows for greater stability under fire conditions, allowing for longer, safe offensive operations.  These buildings may create safety issues for firefighters due to the limited access. This can create issues of occupants interfering with firefighting operations. ',
      'Building Construction:',
      'These buildings hold up well under fire conditions, but it is critical that firefighters not feel a false sense of security, as these buildings are often poorly maintained.',
      'The ceiling presents multiple tactical decision-making options. If convected heat is impeded from the lowest point of the fire extension upward to the ceiling, protected by enclosure and drywall, the fire is contained as a contents fire. ',
      'Likewise, if the fire is in an unprotected attic, the fire is concealed as well as higher HRR because the plume affected shorter, buildings heat quicker, degrading building materials for to collapse stage more rapidly. ',
      'Limited access and egress based on design and construction features. Typically, limited entrance and exit from the occupied structure. These structures are not sealed and provide for natural oxygen exchange, allowing for rapid fire growth and travel. A fire contained to a room and contents shouldn’t weaken the roof structure as it is protected for a theoretical hour rating. ',
      'Void space in older construction is prevalent.',
      'Lidded Buildings, defined as covered ceilings creates compartmenting of the structure and provides protection to the structural members. You will primarily find room and content fires if the compartment is in tact. Versus un-lidded structures, defined as open to the roof. These un-lidded structures are susceptible to structure fires because of its access to unprotected structural members. In either case it is imperative communications occur between interior divisions and ventilation group. Historical collapses are more rapid in lidded structures due to increase heat release rate. '
    );
  } else if (evolution.category === 'Multi Family Legacy') {
    phrases.push(
      'Legacy construction homes were built using solid wood. Solid wood provides greater stability under fire conditions for longer offensive operations. Solid wood burns slower maintaining its strength and form. Reducing the opportunity and time required to enter the collapse stage.',
      'With the renewed emphasis on the topic of fire behavior and building construction, realizing what makes up the environment we work in, is and has always been, important to firefighter safety. Fireground command strategy development requires the evaluation of general styles of construction and the building materials used. This critical information is essential to achieve better fireground decisions. ',
      'Building Construction:',
      'Many buildings are built with a static facade masking the buildings construction type. Roof structures from the legacy era have collar beam and ridge boards often allowing for lofts in the upper levels. These lofts are identifiable by windows in the gable roof area and the dormer style windows on the pitch. This construction type usually consists of raised foundation and/or basement areas. These conditions present a collapse hazard and must be sounded to insure firefighter safety and survival. ',
      'Based on design and construction features, structure is not sealed and provides for natural oxygen exchange allowing for rapid fire growth and travel. If the fire is concealed a higher heat release rate occurs because the plume effect is shorter. Which causes the building to heat quicker degrading building materials to the collapse stage more rapidly. ',
      'Some of the more common failures associated with this structure could be:  roof collapse, floor collapse, stair collapse, interior wall collapse, and masonry veneer failure. '
    );
  } else if (evolution.category === 'Single Family Legacy') {
    phrases.push(
      'Conventional construction of single-family dwellings allows for greater stability under fire conditions, allowing for longer, safe offensive operations. These buildings hold up well under fire conditions, but it is critical that firefighters not feel a false sense of security. ',
      'Building Construction:',
      'The ceiling presents multiple tactical decision-making options. If convected heat is impeded from the lowest point of the fire extension upward to the ceiling, protected by an enclosure and drywall, the fire is contained as a contents fire.',
      'Based on design and construction features this type of structure is not sealed and provides for natural oxygen exchange allowing for rapid fire growth and travel. If the fire is concealed a higher heat release rate occurs because the plume effect is shorter. Which causes the building to heat quicker degrading building materials to the collapse stage more rapidly. A fire contained to a room and contents shouldn’t weaken the roof structure as it is protected for a theoretical hour rating. ',
      'Some of the more common failures associated with this structure could be: roof collapse, floor collapse, stair collapse, interior wall collapse and masonry veneer failure.'
    );
  } else if (evolution.category === 'Multi Family Modern') {
    phrases.push(
      'For this training program there are at least three descriptors to describe multi-family modern style structures.  These descriptors are garden style apartments, center hall style apartments and townhomes. A garden style apartment is any apartment that has entry or egress directly to the exterior of the building.  A center hall style apartment is any apartment that exits into a hall way as its entry and exit. A townhome is a multi story apartment with its entry and exit on the ground floor. ',
      'Modern construction materials burn faster than older construction materials. Older buildings were built using solid wood.  Solid wood structural members will burn slower taking longer to degrade. Newer buildings are built with engineered lumber which are wood fibers glued together. This makes the wood lightweight and strong under normal conditions but allows it to burn quickly and collapse almost instantaneously. Not only does the engineered wood burn more rapidly but modern furniture and coverings which are made out of synthetic materials also are adding to the rate of spread. ',
      'Building Construction:',
      'Lightweight construction uses “Engineered Lumber” a term generally used to describe a wood structural member that is fabricated using bond fibers and materials that is usually put together as a composite joist or beam. ',
      'In modern buildings the ceiling presents multiple tactical decision-making options. ',
      'If convected heat is impeded by an enclosure and drywall from the lowest point, upward to the ceiling, the fire is contained as a room & contents fire. ',
      'Likewise, if the fire is in an unprotected attic, the fire is concealed as well, but will transition to a structure fire rapidly. ',
      'Higher heat release rate occurs because of the plume affect. Shorter buildings heat quicker, rapidly degrading building materials for advancement to collapse stage quickly. ',
      'In a fire that goes unimpeded from the floor to the ceiling the temperature will cool as it rises, reducing heat release rate. Conversely, if stopped by a ceiling the heat release rate is higher and grows more rapidly allowing for faster degrading of building materials. ',
      'Modern construction materials make assembling buildings quicker and less costly, but that also means it will take less time for a building to become completely involved in flames. Fire protection systems help limit the spread of fire allowing occupants time to safely evacuate the involved structure. '
    );
  } else if (evolution.category === 'Single Family Modern') {
    phrases.push(
      'Engine company operations are built upon 8 decades of time-tested and experience-proven strategies and tactics. But such tactics are no longer sufficient for today’s fires.',
      'Today, engine companies must also understand modern fire behavior, rate of heat release and the growth stages of fire. They must constantly evaluate how a structure will "perform" during fire suppression operations. ',
      'Our buildings have changed; differences include the structural components, the degree of compartmentation, the characteristics of materials and the magnitude of fire loading. Engineered structural systems have created large compartment areas, and modern furnishings made from synthetics create extreme fire behavior, compromising structural stability in shorter time periods. This fire behavior and the ever-changing construction scheme decrease the time that safe offensive operations can take place. ',
      'Building Construction:',
      'Modern construction materials burn faster than dimensional lumber. Older buildings were built using solid wood, while newer buildings are built with engineered lumber beams, which wood fibers are joined together. This makes the wood lighter and stronger, this is a trade off of allowing it to burn more rapidly and increase the likelihood of collapse, whereas, solid wood would burn slower retaining its strength and form longer but is more expensive. Furniture and coverings which are made out of synthetic materials increase rate of spread. Because modern construction and furnishings increase flammability it is essential that the buildings fire protection system is properly installed and up-to-date with all building codes and standards. ',
      'The rules for structural fire fighting are changing. The new rules must align traditional tactics with the new science. They must address several areas, including flow rates, extreme fire behavior, and tactical deployment. '
    );
  }

  phrases.push(
    'You have now completed the education phase of this training evolution. We will now proceed to the evaluation phase. '
  );

  return phrases;
}
