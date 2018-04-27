var filterControls = [
  new nyc.Check({
    target: '#type-filter',
    title: 'Location type',
    expanded: true,
    choices: [{
      name: 'type',
      value: 'permanent',
      label: '<img src="img/permanent.png" alt="ID NYC (permanent)">ID NYC (permanent)',
      checked: true
    }, {
      name: 'type',
      value: 'popup',
      label: '<img src="img/popup.png" alt="ID NYC (permanent)">ID NYC (popup)',
      checked: true
    }, {
      name: 'type',
      value: 'cultural',
      label: '<img src="img/cultural.png" alt="Cultural Institution">Cultural Institution',
      checked: true
    }, {
      name: 'type',
      value: 'financial',
      label: '<img src="img/financial.png" alt="Financial Institution">Financial Institution',
      checked: true
    }]
  })
];
