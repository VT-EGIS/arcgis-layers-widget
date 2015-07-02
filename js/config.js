define([], function () {
  return {
    map : {
      logo : false,
      zoom: 15,
      sliderStyle : 'small',
      showAttribution : false,
      center : [-80.422218, 37.227590],
      basemap: 'national-geographic',
      lods: [
        { level : 0, resolution : 156543.033928, scale : 591657527.591555 }, 
        { level : 1, resolution : 78271.5169639999, scale : 295828763.795777 }, 
        { level : 2, resolution : 39135.7584820001, scale : 147914381.897889 }, 
        { level : 3, resolution : 19567.8792409999, scale : 73957190.948944 }, 
        { level : 4, resolution : 9783.93962049996, scale : 36978595.474472 }, 
        { level : 5, resolution : 4891.96981024998, scale : 18489297.737236 }, 
        { level : 6, resolution : 2445.98490512499, scale : 9244648.868618 }, 
        { level : 7, resolution : 1222.99245256249, scale : 4622324.434309 }, 
        { level : 8, resolution : 611.49622628138, scale : 2311162.217155 }, 
        { level : 9, resolution : 305.748113140558, scale : 1155581.108577 }, 
        { level : 10, resolution : 152.874056570411, scale : 577790.554289 }, 
        { level : 11, resolution : 76.4370282850732, scale : 288895.277144 }, 
        { level : 12, resolution : 38.2185141425366, scale : 144447.638572 }, 
        { level : 13, resolution : 19.1092570712683, scale : 72223.819286 }, 
        { level : 14, resolution : 9.55462853563415, scale : 36111.909643 }, 
        { level : 15, resolution : 4.77731426794937, scale : 18055.954822 }, 
        { level : 16, resolution : 2.38865713397468, scale : 9027.977411 },
        { level : 17, resolution : 1.1943285668550503, scale : 4513.988705 },
        { level : 18, resolution : 0.5971642835598172, scale : 2256.994353 },
        { level : 19, resolution : 0.29858214164761665, scale  : 1128.497176 },
        { level : 20, resolution : 0.14929107082380833, scale : 564.248588 }
      ]
    },
    layerInfos: [
      {
        url:'http://arcgis-central.gis.vt.edu/arcgis/rest/services/vtcampusmap/UniRelGrid/MapServer',
        id: 'VT Campus Grid',
        hideOnStartup: true
      },
      {
        url: 'http://arcgis-central.gis.vt.edu/arcgis/rest/services/vtcampusmap/Roads/MapServer',
        id: 'Roads'
      },
      {
        url: 'http://arcgis-central.gis.vt.edu/arcgis/rest/services/vtcampusmap/ParkingLots/MapServer',
        id: 'Parking Lots',
        identifyLayers: [
          {
            infoTemplateTitle: '${LOT_NAME} Parking Lot',
            infoTemplateFields: [
              { title: 'Lot Name', value: '${LOT_NAME}' },
              { title: 'Lot Number', value: '${LOT_NUMBER}' }
            ]
          }
        ],
      },
      {
        url: 'http://arcgis-central.gis.vt.edu/arcgis/rest/services/vtcampusmap/ParkingSpaces/MapServer',
        id: 'Parking Spaces'
      },
      {
        url: 'http://arcgis-central.gis.vt.edu/arcgis/rest/services/vtcampusmap/EmergencyPhones/MapServer',
        id: 'Emergency Phones'
      },
      {
        url: 'http://arcgis-central.gis.vt.edu/arcgis/rest/services/vtcampusmap/Buildings/MapServer',
        id: 'Buildings',
        identifyLayers: [
          {
            infoTemplateTitle: '${NAME}',
            infoTemplateFields: [
              { title: 'Building Use', value: '${BLDG_USE}' },
              { title: 'Building Name', value: '${NAME}' },
              { title: 'Building Number', value: '${BLDG_NUM}' },
              { title: 'Address', value: '${STNUM} ${STPREDIR} ${STNAME} ${STSUFFIX} ${STPOSTDIR}' },
              { title: 'URL', value: '<a href="${URL}" target = "_blank" > ${URL} </a>' }
            ]
          }
        ]
      },
      {
        url: 'http://arcgis-central.gis.vt.edu/arcgis/rest/services/vtcampusmap/AthleticLots/MapServer',
        id: 'Athletic Parking Lots',
        hideOnStartup: true,
      },
      {
        url: 'http://arcgis-central.gis.vt.edu/arcgis/rest/services/vtcampusmap/AlternateTransportation/MapServer',
        id: 'Alternate Transportation',
        identifyLayers: [
          {
            layerName: 'Bus Stops',
            infoTemplateTitle: 'Bus Stop ${ID}',
            infoTemplateFields: [
              { title: 'ID', value: '${ID}' },
              { title: 'Bench', value: '${BENCH}' },
              { title: 'Bench Count', value: '${BENCHCOUNT}' },
              { title: 'Have Shelter', value: '${SHELTER}' },
              { title: 'Image', value: '<img src="${URL}" width="200px" height="200px" />' }
            ]
          },
          {
            layerName: 'Bike Racks',
            infoTemplateTitle: 'Bike Rack ${ID}',
            infoTemplateFields: [
              { title: 'ID', value: '${ID}' },
              { title: 'Condition', value: '${CONDITION}' },
              { title: 'Covered', value: '${COVERED}' },
              { title: 'Max Park Size', value: '${MAXPARK}' },
              { title: 'Number of Bikes', value: '${NUMBIKES}' },
              { title: 'Rack Style', value: '${RACKSTYLE}' },
              { title: 'Number of Racks', value: '${RACKS}' },
              { title: 'Rack Type', value: '${RACKTYPE}' },
              { title: 'Image', value: '<img src="${URL}" width="200px" height="200px" />' }
            ]
          }
        ]
      },
      {
        url: 'http://arcgis-central.gis.vt.edu/arcgis/rest/services/vtcampusmap/Accessibility/MapServer',
        id: 'Accessibility'
      }
    ],
    spatialReference: { wkid: 102100 }
  };
});
