QUnit.module('nyc.Geocoder', {
	beforeEach: function(assert){
		setup(assert, this);
		this.GEOCLIENT_OK_ADDRESS_RESPONSE = {"status":"OK","input":"59 maiden ln, manhattan","results":[{"level":"0","status":"EXACT_MATCH","request":"address [houseNumber=59, street=maiden ln, borough=MANHATTAN, zip=null]","response":{"assemblyDistrict":"65","bbl":"1000670001","bblBoroughCode":"1","bblTaxBlock":"00067","bblTaxLot":"0001","boardOfElectionsPreferredLgc":"1","boePreferredStreetName":"MAIDEN LANE","boePreferredstreetCode":"12563001","boroughCode1In":"1","buildingIdentificationNumber":"1079043","businessImprovementDistrict":"113140","censusBlock2000":"2008","censusBlock2010":"1006","censusTract1990":"  1502","censusTract2000":"  1502","censusTract2010":"  1502","cityCouncilDistrict":"01","civilCourtDistrict":"01","coincidentSegmentCount":"1","communityDistrict":"101","communityDistrictBoroughCode":"1","communityDistrictNumber":"01","communitySchoolDistrict":"02","condominiumBillingBbl":"0000000000","congressionalDistrict":"10","cooperativeIdNumber":"0000","cornerCode":"CR","crossStreetNamesFlagIn":"E","dcpCommercialStudyArea":"11004","dcpPreferredLgc":"01","dotStreetLightContractorArea":"1","dynamicBlock":"206","electionDistrict":"010","fireBattalion":"01","fireCompanyNumber":"004","fireCompanyType":"E","fireDivision":"01","firstBoroughName":"MANHATTAN","firstStreetCode":"12563001010","firstStreetNameNormalized":"MAIDEN LANE","fromLionNodeId":"0015262","fromPreferredLgcsFirstSetOf5":"01","genericId":"0000631","geosupportFunctionCode":"1B","geosupportReturnCode":"00","geosupportReturnCode2":"00","gi5DigitStreetCode1":"25630","gi5DigitStreetCode2":"45440","gi5DigitStreetCode3":"45440","gi5DigitStreetCode4":"24050","giBoroughCode1":"1","giBoroughCode2":"1","giBoroughCode3":"1","giBoroughCode4":"1","giBuildingIdentificationNumber1":"1079043","giBuildingIdentificationNumber2":"1079043","giBuildingIdentificationNumber3":"1079043","giBuildingIdentificationNumber4":"1079043","giDcpPreferredLgc1":"01","giDcpPreferredLgc2":"01","giDcpPreferredLgc3":"01","giDcpPreferredLgc4":"01","giHighHouseNumber1":"65","giHighHouseNumber2":"99","giHighHouseNumber3":"105","giHighHouseNumber4":"68","giLowHouseNumber1":"41","giLowHouseNumber2":"85","giLowHouseNumber3":"101","giLowHouseNumber4":"50","giSideOfStreetIndicator1":"L","giSideOfStreetIndicator2":"L","giSideOfStreetIndicator3":"L","giSideOfStreetIndicator4":"R","giStreetCode1":"12563001","giStreetCode2":"14544001","giStreetCode3":"14544001","giStreetCode4":"12405001","giStreetName1":"MAIDEN LANE","giStreetName2":"WILLIAM STREET","giStreetName3":"WILLIAM STREET","giStreetName4":"JOHN STREET","healthArea":"7700","healthCenterDistrict":"15","highBblOfThisBuildingsCondominiumUnits":"1000670001","highCrossStreetB5SC1":"145440","highCrossStreetCode1":"14544001","highCrossStreetName1":"WILLIAM STREET","highHouseNumberOfBlockfaceSortFormat":"000065000AA","houseNumber":"59","houseNumberIn":"59","houseNumberSortFormat":"000059000AA","hurricaneEvacuationZone":"5","instructionalRegion":"MS","interimAssistanceEligibilityIndicator":"I","internalLabelXCoordinate":"0982037","internalLabelYCoordinate":"0197460","latitude":40.708266006244315,"latitudeInternalLabel":40.7086585249236,"legacySegmentId":"0023213","lionBoroughCode":"1","lionBoroughCodeForVanityAddress":"1","lionFaceCode":"3140","lionFaceCodeForVanityAddress":"3140","lionKey":"1314000030","lionKeyForVanityAddress":"1314000030","lionSequenceNumber":"00030","lionSequenceNumberForVanityAddress":"00030","listOf4Lgcs":"01","longitude":-74.0082309440472,"longitudeInternalLabel":-74.00798211500157,"lowBblOfThisBuildingsCondominiumUnits":"1000670001","lowCrossStreetB5SC1":"127100","lowCrossStreetCode1":"12710001","lowCrossStreetName1":"NASSAU STREET","lowHouseNumberOfBlockfaceSortFormat":"000029000AA","lowHouseNumberOfDefiningAddressRange":"000041000AA","nta":"MN25","ntaName":"Battery Park City-Lower Manhattan","numberOfCrossStreetB5SCsHighAddressEnd":"1","numberOfCrossStreetB5SCsLowAddressEnd":"1","numberOfCrossStreetsHighAddressEnd":"1","numberOfCrossStreetsLowAddressEnd":"1","numberOfEntriesInListOfGeographicIdentifiers":"0004","numberOfExistingStructuresOnLot":"0001","numberOfStreetFrontagesOfLot":"03","physicalId":"0000753","policePatrolBoroughCommand":"1","policePrecinct":"001","returnCode1a":"00","returnCode1e":"00","roadwayType":"1","rpadBuildingClassificationCode":"O3","rpadSelfCheckCodeForBbl":"7","sanbornBoroughCode":"1","sanbornPageNumber":"011","sanbornVolumeNumber":"01","sanbornVolumeNumberSuffix":"S","sanitationDistrict":"101","sanitationSnowPriorityCode":"P","segmentAzimuth":"302","segmentIdentifier":"0023213","segmentLengthInFeet":"00460","segmentOrientation":"4","segmentTypeCode":"U","sideOfStreetIndicator":"L","sideOfStreetOfVanityAddress":"L","splitLowHouseNumber":"000029000AA","stateSenatorialDistrict":"26","streetName1In":"MAIDEN LN","streetStatus":"2","taxMapNumberSectionAndVolume":"10102","toLionNodeId":"0015337","toPreferredLgcsFirstSetOf5":"01","trafficDirection":"A","underlyingStreetCode":"12563001","uspsPreferredCityName":"NEW YORK","workAreaFormatIndicatorIn":"C","xCoordinate":"0981968","xCoordinateHighAddressEnd":"0982031","xCoordinateLowAddressEnd":"0981785","xCoordinateOfCenterofCurvature":"0000000","yCoordinate":"0197317","yCoordinateHighAddressEnd":"0197212","yCoordinateLowAddressEnd":"0197601","yCoordinateOfCenterofCurvature":"0000000","zipCode":"10038"}}],"parseTree":null,"policy":null};
		this.GEOCLIENT_OK_INTERSECTION_RESPONSE = {"status":"OK","input":"w43 st and 9 ave mn","results":[{"level":"0","status":"EXACT_MATCH","request":"intersection [crossStreetOne=w43 st, crossStreetTwo=9 ave, borough=MANHATTAN, compassDirection=null]","response":{"assemblyDistrict":"75","boroughCode1In":"1","censusTract1990":" 121  ","censusTract2000":" 121  ","censusTract2010":" 121  ","cityCouncilDistrict":"03","civilCourtDistrict":"03","communityDistrict":"104","communityDistrictBoroughCode":"1","communityDistrictNumber":"04","communitySchoolDistrict":"02","congressionalDistrict":"10","crossStreetNamesFlagIn":"E","dcpPreferredLgcForStreet1":"01","dcpPreferredLgcForStreet2":"01","dotStreetLightContractorArea":"1","fireBattalion":"09","fireCompanyNumber":"054","fireCompanyType":"E","fireDivision":"03","firstBoroughName":"MANHATTAN","firstStreetCode":"13463001010","firstStreetNameNormalized":"WEST   43 STREET","geosupportFunctionCode":"2","geosupportReturnCode":"00","healthArea":"4500","healthCenterDistrict":"15","instructionalRegion":"MS","interimAssistanceEligibilityIndicator":"E","intersectingStreet1":"110910","intersectingStreet2":"134630","latitude":40.759104364276126,"lionNodeNumber":"0021355","listOfPairsOfLevelCodes":"MMMM","longitude":-73.992141787218,"numberOfIntersectingStreets":"2","numberOfStreetCodesAndNamesInList":"02","policePatrolBoroughCommand":"1","policePrecinct":"014","sanbornBoroughCode1":"1","sanbornBoroughCode2":"1","sanbornPageNumber1":"041","sanbornPageNumber2":"043","sanbornVolumeNumber1":"05","sanbornVolumeNumber2":"05","sanbornVolumeNumberSuffix1":"N","sanbornVolumeNumberSuffix2":"N","sanitationCollectionSchedulingSectionAndSubsection":"3A","sanitationDistrict":"104","secondStreetCode":"11091001010","secondStreetNameNormalized":"9 AVENUE","stateSenatorialDistrict":"27","streetCode1":"11091001","streetCode2":"13463001","streetName1":"9 AVENUE","streetName1In":"W43 ST","streetName2":"WEST   43 STREET","streetName2In":"9 AVE","workAreaFormatIndicatorIn":"C","xCoordinate":"0986427","yCoordinate":"0215839","zipCode":"10036"}}],"parseTree":null,"policy":null};
		this.GEOCLIENT_OK_BLOCKFACE_RESPONSE = {"status":"OK","input":"w 43 st btwn 9 ave and 10av mn","results":[{"level":"0","status":"EXACT_MATCH","request":"blockface [onStreet=w 43 st, crossStreetOne=9 ave, crossStreetTwo=10av, borough=MANHATTAN]","response":{"boroughCode1In":"1","coincidentSegmentCount":"1","crossStreetNamesFlagIn":"E","dcpPreferredLgcForStreet1":"01","dcpPreferredLgcForStreet2":"01","dcpPreferredLgcForStreet3":"02","dotStreetLightContractorArea":"1","firstBoroughName":"MANHATTAN","firstStreetCode":"13463001010","firstStreetNameNormalized":"WEST   43 STREET","fromLgc1":"01","fromNode":"0021355","fromXCoordinate":"0986427","fromYCoordinate":"0215839","generatedRecordFlag":"B","genericId":"0001495","geosupportFunctionCode":"3","geosupportReturnCode":"00","highCrossStreetB5SC1":"111010","highCrossStreetB5SC2":"100403","leftSegment1990CensusTract":" 121  ","leftSegment2000CensusBlock":"3001","leftSegment2000CensusTract":" 121  ","leftSegment2010CensusBlock":"2000","leftSegment2010CensusTract":" 121  ","leftSegmentAssemblyDistrict":"75","leftSegmentCommunityDistrict":"104","leftSegmentCommunityDistrictBoroughCode":"1","leftSegmentCommunityDistrictNumber":"04","leftSegmentCommunitySchoolDistrict":"02","leftSegmentDynamicBlock":"303","leftSegmentElectionDistrict":"072","leftSegmentFireBattalion":"09","leftSegmentFireCompanyNumber":"054","leftSegmentFireCompanyType":"E","leftSegmentFireDivision":"03","leftSegmentHealthArea":"4500","leftSegmentHealthCenterDistrict":"15","leftSegmentHighHouseNumber":"0000498","leftSegmentInterimAssistanceEligibilityIndicator":"E","leftSegmentLowHouseNumber":"0000400","leftSegmentNta":"MN15","leftSegmentNtaName":"Clinton","leftSegmentPolicePatrolBoroughCommand":"1","leftSegmentPolicePrecinct":"010","leftSegmentZipCode":"10036","legacyId":"0033841","lengthOfSegmentInFeet":"00901","lgc1":"01","lionBoroughCode":"1","lionFaceCode":"4995","lionKey":"1499502052","lionSequenceNumber":"02052","lowCrossStreetB5SC1":"110910","modeSwitchIn":"X","numberOfCrossStreetB5SCsHighAddressEnd":"2","numberOfCrossStreetB5SCsLowAddressEnd":"1","numberOfStreetCodesAndNamesInList":"03","physicalId":"0001714","rightSegment1990CensusTract":" 121  ","rightSegment2000CensusBlock":"3000","rightSegment2000CensusTract":" 121  ","rightSegment2010CensusBlock":"3000","rightSegment2010CensusTract":" 121  ","rightSegmentAssemblyDistrict":"75","rightSegmentCommunityDistrict":"104","rightSegmentCommunityDistrictBoroughCode":"1","rightSegmentCommunityDistrictNumber":"04","rightSegmentCommunitySchoolDistrict":"02","rightSegmentDynamicBlock":"302","rightSegmentElectionDistrict":"070","rightSegmentFireBattalion":"09","rightSegmentFireCompanyNumber":"054","rightSegmentFireCompanyType":"E","rightSegmentFireDivision":"03","rightSegmentHealthArea":"4500","rightSegmentHealthCenterDistrict":"15","rightSegmentHighHouseNumber":"0000499","rightSegmentInterimAssistanceEligibilityIndicator":"E","rightSegmentLowHouseNumber":"0000401","rightSegmentNta":"MN15","rightSegmentNtaName":"Clinton","rightSegmentPolicePatrolBoroughCommand":"1","rightSegmentPolicePrecinct":"018","rightSegmentZipCode":"10036","roadwayType":"1","sanitationSnowPriorityCode":"S","secondStreetCode":"11091001010","secondStreetNameNormalized":"9 AVENUE","segmentAzimuth":"151","segmentIdentifier":"9009479","segmentOrientation":"W","segmentTypeCode":"U","streetCode1":"11091001","streetCode6":"11101002","streetCode7":"10040301","streetName1":"9 AVENUE","streetName1In":"W 43 ST","streetName2In":"9 AVE","streetName3In":"10AV","streetName6":"10 AVENUE","streetName7":"STAN BROOKS WAY","streetStatus":"2","thirdStreetCode":"11101002010","thirdStreetNameNormalized":"10 AVENUE","toLgc1":"02","toNode":"0021304","toXCoordinate":"0985640","toYCoordinate":"0216275","trafficDirection":"W","workAreaFormatIndicatorIn":"C"}}],"parseTree":null,"policy":null};
		this.GEOCLIENT_NOT_OK_RESPONSE = {"status":"OK","input":"2 metrotech, ny","results":[{"level":"1","status":"POSSIBLE_MATCH","request":"address [houseNumber=2, street=METRO NORTH  125 STREET, borough=MANHATTAN, zip=null]","response":{"bbl":"1270010091","bblBoroughCode":"1","bblTaxBlock":"27001","bblTaxLot":"0091","boroughCode1In":"1","buildingIdentificationNumber":"1798091","crossStreetNamesFlagIn":"E","firstBoroughName":"MANHATTAN","firstStreetCode":"10089601020","firstStreetNameNormalized":"METRO NORTH  125 STREET","geosupportFunctionCode":"1B","geosupportReturnCode":"58","geosupportReturnCode2":"01","gi5DigitStreetCode1":"00896","giBoroughCode1":"1","giBuildingIdentificationNumber1":"1798091","giDcpPreferredLgc1":"01","giGeographicIdentifier1":"U","giStreetCode1":"10089601","giStreetName1":"METRO NORTH-HARLEM-125 STREET","highBblOfThisBuildingsCondominiumUnits":"1270010091","houseNumberIn":"2","lowBblOfThisBuildingsCondominiumUnits":"1270010091","lowHouseNumberOfDefiningAddressRange":"000001000AA","message":"NON-ADDRESSABLE PLACE NAME, BRIDGE, TUNNEL OR MISC STRUCTURE NOT FOUND","message2":"INPUT IS NON-ADDRESSABLE PLACE NAME (NAP) - ADDRESS NUMBER IGNORED","numberOfEntriesInListOfGeographicIdentifiers":"0001","numberOfExistingStructuresOnLot":"0001","numberOfStreetFrontagesOfLot":"01","reasonCode1a":"I","reasonCode2":"I","returnCode1a":"01","returnCode1e":"58","sanbornBoroughCode":"1","streetName1In":"METRO NORTH  125 STREET","taxMapNumberSectionAndVolume":"1","workAreaFormatIndicatorIn":"C"}},{"level":"1","status":"POSSIBLE_MATCH","request":"address [houseNumber=2, street=METRO NORTH BRIDGE, borough=MANHATTAN, zip=null]","response":{"assemblyDistrict":"68","boardOfElectionsPreferredLgc":"1","boePreferredStreetName":"METRO NORTH BRIDGE","boePreferredstreetCode":"10047101","boroughCode1In":"1","censusBlock2000":"9998","censusBlock2010":"0001","censusTract1990":" 204  ","censusTract2000":" 204  ","censusTract2010":" 242  ","cityCouncilDistrict":"09","coincidentSegmentCount":"1","communityDistrict":"111","communityDistrictBoroughCode":"1","communityDistrictNumber":"11","congressionalDistrict":"13","crossStreetNamesFlagIn":"E","dcpPreferredLgc":"01","dotStreetLightContractorArea":"1","dynamicBlock":"006","electionDistrict":"109","featureTypeCode":"2","firstBoroughName":"MANHATTAN","firstStreetCode":"10047101010","firstStreetNameNormalized":"METRO NORTH BRIDGE","fromLionNodeId":"0042577","fromPreferredLgcsFirstSetOf5":"04","fromPreferredLgcsSecondSetOf5":"01","geosupportFunctionCode":"1B","geosupportReturnCode":"01","geosupportReturnCode2":"58","healthArea":"1700","healthCenterDistrict":"12","highCrossStreetB5SC1":"197890","highCrossStreetCode1":"19789004","highCrossStreetName1":"MADISON AVE BRDG PED & BIKE PATH","highHouseNumberOfBlockfaceSortFormat":"000000000AA","houseNumberIn":"2","hurricaneEvacuationZone":"0","individualSegmentLength":"00209","instructionalRegion":"BX","interimAssistanceEligibilityIndicator":"E","latitude":40.81110680025393,"lionBoroughCode":"1","lionBoroughCodeForVanityAddress":"1","lionFaceCode":"3750","lionFaceCodeForVanityAddress":"3750","lionKey":"1375000185","lionKeyForVanityAddress":"1375000185","lionSequenceNumber":"00185","lionSequenceNumberForVanityAddress":"00185","listOf4Lgcs":"01","longitude":-73.93422770666182,"lowCrossStreetB5SC1":"125985","lowCrossStreetCode1":"12598504","lowCrossStreetName1":"METRO NORTH-HARLEM LINE","lowHouseNumberOfBlockfaceSortFormat":"000000000AA","message":"INPUT IS NON-ADDRESSABLE PLACE NAME (NAP) - ADDRESS NUMBER IGNORED","message2":"NON-ADDRESSABLE PLACE NAME, BRIDGE, TUNNEL OR MISC STRUCTURE NOT FOUND","noCrossStreetCalculationFlag":"Y","nta":"MN34","ntaName":"East Harlem North","numberOfCrossStreetB5SCsHighAddressEnd":"1","numberOfCrossStreetB5SCsLowAddressEnd":"1","numberOfCrossStreetsHighAddressEnd":"1","numberOfCrossStreetsLowAddressEnd":"1","numberOfStreetCodesAndNamesInList":"02","policePatrolBoroughCommand":"3","policePrecinct":"040","reasonCode":"I","reasonCode1e":"I","returnCode1a":"58","returnCode1e":"01","sanitationDistrict":"111","segmentAzimuth":"083","segmentIdentifier":"0191685","segmentLengthInFeet":"00209","segmentOrientation":"2","segmentTypeCode":"U","sideOfStreetIndicator":"R","sideOfStreetOfVanityAddress":"R","specialAddressGeneratedRecordFlag":"N","splitLowHouseNumber":"000001000AA","stateSenatorialDistrict":"30","streetCode1":"12598503","streetCode6":"19789001","streetName1":"METRO NORTH RAILROAD","streetName1In":"METRO NORTH BRIDGE","streetName6":"MADISON AVENUE BRIDGE","toLionNodeId":"9031846","toPreferredLgcsFirstSetOf5":"04","underlyingHnsOnTrueStreet":"000000000AA","underlyingStreetCode":"13049720","uspsPreferredCityName":"NEW YORK","workAreaFormatIndicatorIn":"C","xCoordinate":"1002457","xCoordinateHighAddressEnd":"1002555","xCoordinateLowAddressEnd":"1002442","xCoordinateOfCenterofCurvature":"0000000","yCoordinate":"0234792","yCoordinateHighAddressEnd":"0235869","yCoordinateLowAddressEnd":"0234689","yCoordinateOfCenterofCurvature":"0000000"}},{"level":"1","status":"POSSIBLE_MATCH","request":"address [houseNumber=2, street=METRO NORTH COMPLEX, borough=MANHATTAN, zip=null]","response":{"assemblyDistrict":"68","bbl":"1016730001","bblBoroughCode":"1","bblTaxBlock":"01673","bblTaxLot":"0001","boardOfElectionsPreferredLgc":"1","boePreferredStreetName":"METRO NORTH PLAZA","boePreferredstreetCode":"11269001","boroughCode1In":"1","buildingIdentificationNumber":"1000000","censusBlock2000":"2000","censusBlock2010":"2000","censusTract1990":" 164  ","censusTract2000":" 164  ","censusTract2010":" 164  ","cityCouncilDistrict":"08","civilCourtDistrict":"06","coincidentSegmentCount":"1","communityDistrict":"111","communityDistrictBoroughCode":"1","communityDistrictNumber":"11","communitySchoolDistrict":"04","condominiumBillingBbl":"0000000000","congressionalDistrict":"13","cooperativeIdNumber":"0000","cornerCode":"NE","crossStreetNamesFlagIn":"E","dcpPreferredLgc":"01","dotStreetLightContractorArea":"1","dynamicBlock":"201","electionDistrict":"045","fireBattalion":"10","fireCompanyNumber":"043","fireCompanyType":"L","fireDivision":"03","firstBoroughName":"MANHATTAN","firstStreetCode":"11269001040","firstStreetNameNormalized":"METRO NORTH COMPLEX","fromLionNodeId":"0023822","fromPreferredLgcsFirstSetOf5":"01","genericId":"0089606","geosupportFunctionCode":"1B","geosupportReturnCode":"01","geosupportReturnCode2":"01","gi5DigitStreetCode1":"12690","gi5DigitStreetCode2":"25996","gi5DigitStreetCode3":"18990","gi5DigitStreetCode4":"12690","gi5DigitStreetCode5":"18990","gi5DigitStreetCode6":"18990","gi5DigitStreetCode7":"18990","gi5DigitStreetCode8":"10110","gi5DigitStreetCode9":"18990","giBoroughCode1":"1","giBoroughCode2":"1","giBoroughCode3":"1","giBoroughCode4":"1","giBoroughCode5":"1","giBoroughCode6":"1","giBoroughCode7":"1","giBoroughCode8":"1","giBoroughCode9":"1","giBuildingIdentificationNumber1":"1000000","giBuildingIdentificationNumber2":"1000000","giBuildingIdentificationNumber3":"1052653","giBuildingIdentificationNumber4":"1052653","giBuildingIdentificationNumber5":"1081355","giBuildingIdentificationNumber6":"1081356","giBuildingIdentificationNumber7":"1081357","giBuildingIdentificationNumber8":"1081358","giBuildingIdentificationNumber9":"1081358","giDcpPreferredLgc1":"01","giDcpPreferredLgc2":"01","giDcpPreferredLgc3":"01","giDcpPreferredLgc4":"02","giDcpPreferredLgc5":"01","giDcpPreferredLgc6":"01","giDcpPreferredLgc7":"01","giDcpPreferredLgc8":"01","giDcpPreferredLgc9":"01","giGeographicIdentifier1":"G","giGeographicIdentifier2":"G","giGeographicIdentifier4":"X","giHighHouseNumber3":"305","giHighHouseNumber5":"303","giHighHouseNumber6":"303 REAR-A","giHighHouseNumber7":"303 REAR-B","giHighHouseNumber8":"1972","giHighHouseNumber9":"301","giLowHouseNumber3":"305","giLowHouseNumber5":"303","giLowHouseNumber6":"303 REAR-A","giLowHouseNumber7":"303 REAR-B","giLowHouseNumber8":"1968","giLowHouseNumber9":"301","giSideOfStreetIndicator1":"L","giSideOfStreetIndicator3":"L","giSideOfStreetIndicator4":"L","giSideOfStreetIndicator5":"L","giSideOfStreetIndicator6":"L","giSideOfStreetIndicator7":"L","giSideOfStreetIndicator8":"R","giSideOfStreetIndicator9":"L","giStreetCode1":"11269001","giStreetCode2":"12599601","giStreetCode3":"11899001","giStreetCode4":"11269002","giStreetCode5":"11899001","giStreetCode6":"11899001","giStreetCode7":"11899001","giStreetCode8":"11011001","giStreetCode9":"11899001","giStreetName1":"METRO NORTH PLAZA","giStreetName2":"METRO NORTH REHAB","giStreetName3":"EAST  101 STREET","giStreetName4":"METRO NORTH PLAZA BUILDING    1","giStreetName5":"EAST  101 STREET","giStreetName6":"EAST  101 STREET","giStreetName7":"EAST  101 STREET","giStreetName8":"2 AVENUE","giStreetName9":"EAST  101 STREET","healthArea":"2600","healthCenterDistrict":"12","highBblOfThisBuildingsCondominiumUnits":"1016730001","highCrossStreetB5SC1":"110010","highCrossStreetCode1":"11001001","highCrossStreetName1":"1 AVENUE","highHouseNumberOfBlockfaceSortFormat":"000000000AA","houseNumberIn":"2","hurricaneEvacuationZone":"3","individualSegmentLength":"00047","instructionalRegion":"MN","interimAssistanceEligibilityIndicator":"E","internalLabelXCoordinate":"0999682","internalLabelYCoordinate":"0226174","latitude":40.787284661770386,"latitudeInternalLabel":40.7874580288217,"legacySegmentId":"0038065","lionBoroughCode":"1","lionBoroughCodeForVanityAddress":"1","lionFaceCode":"2060","lionFaceCodeForVanityAddress":"2060","lionKey":"1206002020","lionKeyForVanityAddress":"1206002020","lionSequenceNumber":"02020","lionSequenceNumberForVanityAddress":"02020","listOf4Lgcs":"01","longitude":-73.94335141575736,"longitudeInternalLabel":-73.94427212173069,"lowBblOfThisBuildingsCondominiumUnits":"1016730001","lowCrossStreetB5SC1":"110110","lowCrossStreetCode1":"11011001","lowCrossStreetName1":"2 AVENUE","lowHouseNumberOfBlockfaceSortFormat":"000000000AA","lowHouseNumberOfDefiningAddressRange":"000001000AA","message":"INPUT IS A COMPLEX. OUTPUT DATA MAY PERTAIN TO ONLY PART OF THE COMPLEX","message2":"INPUT IS NON-ADDRESSABLE PLACE NAME (NAP) - ADDRESS NUMBER IGNORED","noCrossStreetCalculationFlag":"Y","nta":"MN33","ntaName":"East Harlem South","numberOfCrossStreetB5SCsHighAddressEnd":"1","numberOfCrossStreetB5SCsLowAddressEnd":"1","numberOfCrossStreetsHighAddressEnd":"1","numberOfCrossStreetsLowAddressEnd":"1","numberOfEntriesInListOfGeographicIdentifiers":"0009","numberOfExistingStructuresOnLot":"0005","numberOfStreetFrontagesOfLot":"02","nypdId":"0004805","physicalId":"0101598","policePatrolBoroughCommand":"2","policePrecinct":"023","reasonCode":"5","reasonCode1a":"I","reasonCode1e":"5","reasonCode2":"I","returnCode1a":"01","returnCode1e":"01","roadwayType":"1","rpadBuildingClassificationCode":"K2","rpadSelfCheckCodeForBbl":"1","sanbornBoroughCode":"1","sanbornPageNumber":"054","sanbornVolumeNumber":"08","sanbornVolumeNumberSuffix":"N","sanitationCollectionSchedulingSectionAndSubsection":"1B","sanitationDistrict":"111","sanitationRecyclingCollectionSchedule":"ET","sanitationRegularCollectionSchedule":"TTHS","sanitationSnowPriorityCode":"P","segmentAzimuth":"330","segmentIdentifier":"9004801","segmentLengthInFeet":"00047","segmentOrientation":"E","segmentTypeCode":"U","sideOfStreetIndicator":"L","sideOfStreetOfVanityAddress":"L","specialAddressGeneratedRecordFlag":"G","splitLowHouseNumber":"000001000AA","stateSenatorialDistrict":"29","streetName1In":"METRO NORTH COMPLEX","streetStatus":"2","taxMapNumberSectionAndVolume":"10605","toLionNodeId":"0041985","toPreferredLgcsFirstSetOf5":"01","trafficDirection":"A","underlyingHnsOnTrueStreet":"000000000AA","underlyingStreetCode":"11899001","uspsPreferredCityName":"NEW YORK","workAreaFormatIndicatorIn":"C","xCoordinate":"0999937","xCoordinateHighAddressEnd":"1000206","xCoordinateLowAddressEnd":"0999544","xCoordinateOfCenterofCurvature":"0000000","yCoordinate":"0226111","yCoordinateHighAddressEnd":"0225798","yCoordinateLowAddressEnd":"0226168","yCoordinateOfCenterofCurvature":"0000000","zipCode":"10029"}},{"level":"1","status":"POSSIBLE_MATCH","request":"address [houseNumber=2, street=METRO NORTH PARK, borough=MANHATTAN, zip=null]","response":{"assemblyDistrict":"68","boardOfElectionsPreferredLgc":"1","boePreferredStreetName":"FIELD OF DREAMS","boePreferredstreetCode":"11249501","boroughCode1In":"1","censusBlock2000":"2001","censusBlock2010":"2001","censusTract1990":" 164  ","censusTract2000":" 164  ","censusTract2010":" 164  ","cityCouncilDistrict":"08","civilCourtDistrict":"06","coincidentSegmentCount":"1","communityDistrict":"111","communityDistrictBoroughCode":"1","communityDistrictNumber":"11","communitySchoolDistrict":"04","congressionalDistrict":"13","crossStreetNamesFlagIn":"E","dcpPreferredLgc":"01","dotStreetLightContractorArea":"1","dynamicBlock":"202","electionDistrict":"019","fireBattalion":"10","fireCompanyNumber":"043","fireCompanyType":"L","fireDivision":"03","firstBoroughName":"MANHATTAN","firstStreetCode":"11249501010","firstStreetNameNormalized":"METRO NORTH PARK","fromLionNodeId":"0023818","fromPreferredLgcsFirstSetOf5":"0101","genericId":"0085505","geosupportFunctionCode":"1B","geosupportReturnCode":"01","geosupportReturnCode2":"58","healthArea":"2600","healthCenterDistrict":"12","highCrossStreetB5SC1":"110010","highCrossStreetCode1":"11001001","highCrossStreetName1":"1 AVENUE","highHouseNumberOfBlockfaceSortFormat":"000000000AA","houseNumberIn":"2","hurricaneEvacuationZone":"3","instructionalRegion":"MN","interimAssistanceEligibilityIndicator":"E","latitude":40.7866536331164,"legacySegmentId":"0038058","lionBoroughCode":"1","lionBoroughCodeForVanityAddress":"1","lionFaceCode":"2050","lionFaceCodeForVanityAddress":"2050","lionKey":"1205000120","lionKeyForVanityAddress":"1205000120","lionSequenceNumber":"00120","lionSequenceNumberForVanityAddress":"00120","listOf4Lgcs":"01","longitude":-73.94388279119198,"lowCrossStreetB5SC1":"110110","lowCrossStreetB5SC2":"100406","lowCrossStreetCode1":"11011001","lowCrossStreetCode2":"10040601","lowCrossStreetName1":"2 AVENUE","lowCrossStreetName2":"REVS NORM AND PEG EDDY WAY","lowHouseNumberOfBlockfaceSortFormat":"000000000AA","message":"INPUT IS NON-ADDRESSABLE PLACE NAME (NAP) - ADDRESS NUMBER IGNORED","message2":"NON-ADDRESSABLE PLACE NAME, BRIDGE, TUNNEL OR MISC STRUCTURE NOT FOUND","nta":"MN33","ntaName":"East Harlem South","numberOfCrossStreetB5SCsHighAddressEnd":"1","numberOfCrossStreetB5SCsLowAddressEnd":"2","numberOfCrossStreetsHighAddressEnd":"1","numberOfCrossStreetsLowAddressEnd":"2","numberOfStreetCodesAndNamesInList":"03","nypdId":"0000084","physicalId":"0097278","policePatrolBoroughCommand":"2","policePrecinct":"023","reasonCode":"I","reasonCode1e":"I","returnCode1a":"58","returnCode1e":"01","roadwayType":"1","sanitationCollectionSchedulingSectionAndSubsection":"1B","sanitationDistrict":"111","sanitationRecyclingCollectionSchedule":"ET","sanitationRegularCollectionSchedule":"TTHS","sanitationSnowPriorityCode":"P","segmentAzimuth":"329","segmentIdentifier":"9000084","segmentLengthInFeet":"00024","segmentOrientation":"E","segmentTypeCode":"U","sideOfStreetIndicator":"L","sideOfStreetOfVanityAddress":"L","specialAddressGeneratedRecordFlag":"N","splitLowHouseNumber":"000001000AA","stateSenatorialDistrict":"29","streetCode1":"11011001","streetCode2":"10040601","streetCode6":"11001001","streetName1":"2 AVENUE","streetName1In":"METRO NORTH PARK","streetName2":"REVS NORM AND PEG EDDY WAY","streetName6":"1 AVENUE","streetStatus":"2","toLionNodeId":"0041984","toPreferredLgcsFirstSetOf5":"01","trafficDirection":"W","underlyingHnsOnTrueStreet":"000000000AA","underlyingStreetCode":"11897001","uspsPreferredCityName":"NEW YORK","workAreaFormatIndicatorIn":"C","xCoordinate":"0999790","xCoordinateHighAddressEnd":"1000077","xCoordinateLowAddressEnd":"0999417","xCoordinateOfCenterofCurvature":"0000000","yCoordinate":"0225881","yCoordinateHighAddressEnd":"0225572","yCoordinateLowAddressEnd":"0225937","yCoordinateOfCenterofCurvature":"0000000","zipCode":"10029"}}],"parseTree":null,"policy":null};
		this.GEOCLIENT_NON_ADDRESSABLE_RESPONSE = {"status":"OK","input":"Metro North 125 Street, Manhattan","results":[{"level":"0","status":"EXACT_MATCH","request":"place [name=Metro North 125 Street, borough=MANHATTAN, zip=null]","response":{"bbl":"1270010091","bblBoroughCode":"1","bblTaxBlock":"27001","bblTaxLot":"0091","boroughCode1In":"1","buildingIdentificationNumber":"1798091","crossStreetNamesFlagIn":"E","firstBoroughName":"MANHATTAN","firstStreetCode":"10089601020","firstStreetNameNormalized":"METRO NORTH  125 STREET","geosupportFunctionCode":"1B","geosupportReturnCode":"58","geosupportReturnCode2":"00","gi5DigitStreetCode1":"00896","giBoroughCode1":"1","giBuildingIdentificationNumber1":"1798091","giDcpPreferredLgc1":"01","giGeographicIdentifier1":"U","giStreetCode1":"10089601","giStreetName1":"METRO NORTH-HARLEM-125 STREET","highBblOfThisBuildingsCondominiumUnits":"1270010091","lowBblOfThisBuildingsCondominiumUnits":"1270010091","lowHouseNumberOfDefiningAddressRange":"000001000AA","message":"NON-ADDRESSABLE PLACE NAME, BRIDGE, TUNNEL OR MISC STRUCTURE NOT FOUND","numberOfEntriesInListOfGeographicIdentifiers":"0001","numberOfExistingStructuresOnLot":"0001","numberOfStreetFrontagesOfLot":"01","returnCode1a":"00","returnCode1e":"58","sanbornBoroughCode":"1","streetName1In":"METRO NORTH 125 STREET","taxMapNumberSectionAndVolume":"1","workAreaFormatIndicatorIn":"C"}}],"parseTree":null,"policy":null};
	},
	afterEach: function(assert){
		teardown(assert, this);
		delete this.GEOCLIENT_OK_ADDRESS_RESPONSE;
		delete this.GEOCLIENT_OK_INTERSECTION_RESPONSE;
		delete this.GEOCLIENT_OK_BLOCKFACE_RESPONSE;
		delete this.GEOCLIENT_NOT_OK_RESPONSE;
		delete this.GEOCLIENT_NON_ADDRESSABLE_RESPONSE;
	}
});

QUnit.test('project', function(assert){
	assert.expect(2);

	var geocoder = new nyc.Geoclient();
	var coordinates = [981631, 202242];
	assert.deepEqual(geocoder.project(coordinates), coordinates);
	geocoder = new nyc.Geoclient(null, 'EPSG:4326');
	assert.deepEqual(geocoder.project(coordinates), [-74.00944838513226, 40.72178386137363]);
});

QUnit.test('parse (address)', function(assert){
	assert.expect(1);

	var geocoder = new nyc.Geoclient();
	assert.deepEqual(
		geocoder.parse(this.GEOCLIENT_OK_ADDRESS_RESPONSE.results[0]),
		{
			type: nyc.Locate.ResultType.GEOCODE,
			coordinates: [982037, 197460],
			accuracy: nyc.Geocoder.Accuracy.HIGH,
			name: '59 Maiden Lane, Manhattan, NY 10038',
			data: this.GEOCLIENT_OK_ADDRESS_RESPONSE.results[0].response
		}
	);
});

QUnit.test('parse (intersection)', function(assert){
	assert.expect(1);

	var geocoder = new nyc.Geoclient();
	assert.deepEqual(
		geocoder.parse(this.GEOCLIENT_OK_INTERSECTION_RESPONSE.results[0]),
		{
			type: nyc.Locate.ResultType.GEOCODE,
			coordinates: [0986427, 215839],
			accuracy: nyc.Geocoder.Accuracy.MEDIUM,
			name: '9 Avenue And West 43 Street, Manhattan, NY 10036',
			data: this.GEOCLIENT_OK_INTERSECTION_RESPONSE.results[0].response	
		}
	);
});

QUnit.test('parse (blockface)', function(assert){
	assert.expect(1);

	var geocoder = new nyc.Geoclient();
	assert.deepEqual(
		geocoder.parse(this.GEOCLIENT_OK_BLOCKFACE_RESPONSE.results[0]),
		{
			type: nyc.Locate.ResultType.GEOCODE,
			coordinates: [986033.5, 216057],
			accuracy: nyc.Geocoder.Accuracy.LOW,
			name: 'West 43 Street Btwn 9 Avenue & 10 Avenue, Manhattan, NY 10036',
			data: this.GEOCLIENT_OK_BLOCKFACE_RESPONSE.results[0].response				
		}
	);
});

QUnit.test('possible', function(assert){
	assert.expect(1);

	var geocoder = new nyc.Geoclient();
	assert.deepEqual(
		geocoder.possible(this.GEOCLIENT_NOT_OK_RESPONSE.results),
		[{
			accuracy: 100,
			coordinates: [1002457, 234792],
			name: 'Metro North Bridge, Manhattan, NY ',
			type: 'geocode',
			data: this.GEOCLIENT_NOT_OK_RESPONSE.results[1].response
		},
		{
			accuracy: 0,
			coordinates: [999682, 226174],
			name: 'Metro North Complex, Manhattan, NY 10029',
			type: 'geocode',
			data: this.GEOCLIENT_NOT_OK_RESPONSE.results[2].response
		},
		{
			accuracy: 100,
			coordinates: [999790, 225881],
			name: 'Metro North Park, Manhattan, NY 10029',
			type: 'geocode',
			data: this.GEOCLIENT_NOT_OK_RESPONSE.results[3].response
		}]
	);
});

QUnit.test('geoclient (geocoded)', function(assert){
	assert.expect(1);
	
	var response = this.GEOCLIENT_OK_ADDRESS_RESPONSE;
	
	var geocoder = new nyc.Geoclient();
	geocoder.on(nyc.Locate.EventType.GEOCODE, function(data){
		assert.deepEqual(
			data,
			{
				type: nyc.Locate.ResultType.GEOCODE,
				coordinates: [982037, 197460],
				accuracy: nyc.Geocoder.Accuracy.HIGH,
				name: '59 Maiden Lane, Manhattan, NY 10038',
				data: response.results[0].response			
			}
		);
	});
	geocoder.geoclient(response);
});

QUnit.test('geoclient (non addressable)', function(assert){
	assert.expect(1);

	var geocoder = new nyc.Geoclient();
	geocoder.one(nyc.Locate.EventType.AMBIGUOUS, function(data){
		assert.deepEqual(data, {input: 'Metro North 125 Street, Manhattan', possible: []});

	});
	geocoder.geoclient(this.GEOCLIENT_NON_ADDRESSABLE_RESPONSE)
});

QUnit.test('geoclient (ambiguous)', function(assert){
	assert.expect(1);

	var response = this.GEOCLIENT_NOT_OK_RESPONSE;
	var geocoder = new nyc.Geoclient();
	geocoder.on(nyc.Locate.EventType.AMBIGUOUS, function(data){
		assert.deepEqual(data, {
			input: '2 metrotech, ny',
			possible: [
	           {
	        	   accuracy: 100,
	        	   coordinates: [1002457, 234792],
	        	   name: 'Metro North Bridge, Manhattan, NY ',
	        	   type: 'geocode',
					data: response.results[1].response
	           },
	           {
	        	   accuracy: 0,
	        	   coordinates: [999682, 226174],
	        	   name: 'Metro North Complex, Manhattan, NY 10029',
	        	   type: 'geocode',
					data: response.results[2].response
	           },
	           {
	        	   accuracy: 100,
	        	   coordinates: [999790, 225881],
	        	   name: 'Metro North Park, Manhattan, NY 10029',
	        	   type: 'geocode',
					data: response.results[3].response
	           }
           ]
		});
	});
	geocoder.geoclient(response);
});

QUnit.test('search (zip code)', function(assert){
	assert.expect(1);

	var geocoder = new nyc.Geoclient();
	geocoder.one(nyc.Locate.EventType.GEOCODE, function(data){
		assert.deepEqual(
			data,
			{
				type: nyc.Locate.ResultType.GEOCODE,
				coordinates: nyc.Geoclient.ZIP_CODE_POINTS['10038'],
				accuracy: nyc.Geocoder.Accuracy.ZIP_CODE,
				name: '10038',
				zip: true
			}
		);
	});
	geocoder.search('10038');
});

QUnit.test('search (address)', function(assert){
	assert.expect(1);
	if (this.GEOCLIENT_URL.indexOf('YOUR_APP_KEY') == -1){
		
		var done = assert.async();
		
		var test = function(data){
			assert.deepEqual(
				data,
				{
					type: nyc.Locate.ResultType.GEOCODE,
					coordinates: [982037, 197460],
					accuracy: nyc.Geocoder.Accuracy.HIGH,
					name: '59 Maiden Lane, Manhattan, NY 10038'			
				}
			);
			done();
		};

		var geocoder = new nyc.Geoclient(this.GEOCLIENT_URL);
		geocoder.one(nyc.Locate.EventType.GEOCODE, test);
		geocoder.search('59 maiden mn');
		
	}else{
		assert.ok(false, 'Valid geoclient appKey and appId required to run this test. See README.md for configuration details.')
	}
});

QUnit.test('search (error)', function(assert){
	assert.expect(1);
	var done = assert.async();
	
	var test = function(data){
		assert.ok(true);
		done();
	};

	var geocoder = new nyc.Geoclient('');
	geocoder.one(nyc.Locate.EventType.ERROR, test);
	geocoder.search('59 maiden mn');
});
