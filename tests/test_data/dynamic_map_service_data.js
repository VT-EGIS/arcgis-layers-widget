define([], function () {
  return [
    {
      id: 0,
      name: 'layer-0',
      defaultVisibility: true,
      subLayerIds: [ 1, 4, 7 ] 
    },
    {
      id: 1,
      name: 'layer-1',
      subLayerIds: [ 2, 3 ] 
    },
    {
      id: 2,
      name: 'layer-2',
      subLayerIds: null 
    },
    {
      id: 3,
      name: 'layer-3',
      subLayerIds: null 
    },
    {
      id: 4,
      name: 'layer-4',
      subLayerIds: [5, 6] 
    },
    {
      id: 5,
      name: 'layer-5',
      subLayerIds: null 
    },
    {
      id: 6,
      name: 'layer-6',
      subLayerIds: null 
    },
    {
      id: 7,
      name: 'layer-7',
      subLayerIds: null 
    }
  ];
});
