/******************************************************************************

Copyright (c) 2016, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

******************************************************************************/

// @format

highed.DrawerEditor = function(parent, options) {
  var events = highed.events(),
    // Main properties
    properties = highed.merge(
      {
        showToolbar: true,
        features: [
          'data',
          'templates',
          'customize',
          'customcode',
          'advanced',
          'export'
        ],
        toolbarIcons: []
      },
      options
    ),
    splitter = highed.VSplitter(parent, {
      topHeight: '60px',
      noOverflow: true
    }),
    toolbar = highed.Toolbar(splitter.top),
    toolbox = highed.Toolbox(splitter.bottom),
    // Data table
    dataTableContainer = highed.dom.cr('div', 'highed-box-size highed-fill'),
    dataTable = highed.DataTable(dataTableContainer),
    // Chart preview
    chartFrame = highed.dom.cr(
      'div',
      'highed-transition highed-box-size highed-chart-frame'
    ),
    chartContainer = highed.dom.cr(
      'div',
      'highed-box-size highed-chart-frame-body'
    ),
    chartPreview = highed.ChartPreview(chartContainer),
    // Exporter
    exporterContainer = highed.dom.cr('div', 'highed-box-size highed-fill'),
    exporter = highed.Exporter(exporterContainer),
    // Templates
    templatesContainer = highed.dom.cr('div', 'highed-box-size highed-fill'),
    templates = highed.ChartTemplateSelector(templatesContainer, chartPreview),
    // Customizer
    customizerContainer = highed.dom.cr('div', 'highed-box-size highed-fill'),
    customizer = highed.ChartCustomizer(customizerContainer, {}, chartPreview),
    // Toolbar buttons
    toolbarButtons = [
      {
        title: highed.L('newChart'),
        css: 'fa-file',
        click: function() {
          if (window.confirm(highed.getLocalizedStr('confirmNewChart'))) {
            chartPreview.new();
          }
        }
      },
      {
        title: highed.L('saveProject'),
        css: 'fa-floppy-o',
        click: function() {
          highed.download('chart.json', chartPreview.toProjectStr());
        }
      },
      {
        title: highed.L('openProject'),
        css: 'fa-folder-open',
        click: function() {
          highed.readLocalFile({
            type: 'text',
            accept: '.json',
            success: function(file) {
              try {
                file = JSON.parse(file.data);
              } catch (e) {
                return highed.snackBar('Error loading JSON: ' + e);
              }

              chartPreview.loadProject(file);
            }
          });
        }
      },
      '-',
      {
        title: highed.L('saveCloud'),
        css: 'fa-cloud-upload',
        click: function() {
          highed.cloud.save(chartPreview);
        }
      },
      {
        title: highed.L('loadCloud'),
        css: 'fa-cloud-download',
        click: function() {
          highed.cloud.showUI(chartPreview);
        }
      },
      '-',
      {
        title: 'Help',
        css: 'fa-question-circle',
        click: function() {
          window.open(highed.option('helpURL'));
        }
      }
    ].concat(properties.toolbarIcons),
    // Custom toolbox options
    customOptions = {},
    // The toolbox options
    builtInOptions = {
      data: {
        icon: 'fa-table',
        title: 'Chart Data',
        width: 800,
        help: [
          {
            title: 'Manually Add/Edit Data',
            gif: '/help/dataImport.gif',
            description: [
              'Data can be manually entered and modified directly in the data table.<br/><br/>',
              'The cells can be navigated using the arrow keys.',
              'Pressing Enter creates a new row, or navigates to the row directly below the current row.<br/><br/>',
              'The headings are used as the axis titles, and can be changed by clicking them.'
            ]
          },
          {
            title: 'Importing Data',
            description: [
              'To import data, simply drag and drop CSV files onto the table.<br/><br/>',
              'For more advanced data import, click the IMPORT button to',
              'summon the import panel. Here, you can paste CSV, import CSV from',
              'an URL, import data from a google spreadsheet, and more.'
            ]
          }
        ],
        create: function(body) {
          highed.dom.ap(body, dataTableContainer);
          dataTable.resize();
        },
        events: {
          Expanded: function(width, height) {
            console.log('expanding', width, height);
            dataTable.resize(width, height);
          }
        }
      },
      templates: {
        icon: 'fa-image',
        width: 700,
        title: 'Templates',
        help: [
          {
            title: 'Templates',
            description: [
              'The templates view lets you choose a template for your chart.<br/><br/>',
              'Templates are pre-defined bundles of configuration.',
              'Start by choosing the template category in the list to the left,',
              'then pick a suitable template for your data and use case in the',
              'template list.'
            ]
          }
        ],
        create: function(body) {
          highed.dom.ap(body, templatesContainer);
        },
        events: {
          Expanded: function(width, height) {
            templates.resize(width, height);
          }
        }
      },
      export: {
        icon: 'fa-download',
        title: 'Export',
        width: 600,
        help: [
          {
            title: 'Export',
            description: [
              'The export pane lets you export your chart to HTML, SVG, JSON, or JavaScript.<br/><br/>'
            ]
          }
        ],
        create: function(body) {
          highed.dom.ap(body, exporterContainer);
          exporter.resize();
        },
        events: {
          Expanded: function(width, height) {
            exporter.resize(width, height);
            exporter.init(
              chartPreview.export.json(),
              chartPreview.export.html(),
              chartPreview.export.svg(),
              chartPreview
            );
          }
        }
      },
      customize: {
        icon: 'fa-sliders',
        title: 'Customize',
        width: 800,
        help: [
          {
            title: 'Customize',
            description: [
              'The customize pane lets you customize your chart.<br/><br/>',
              'The customizer has three different sections:<br/>',
              '<li>Simple: A simple customizer with the most used options</li>',
              '<li>Advanced: All options available in Highcharts/Highstock can be set here</li>',
              '<li>Custom code: Here, properties can be overridden programatically</li>'
            ]
          }
        ],
        create: function(body) {
          highed.dom.ap(body, customizerContainer);
          customizer.resize();
        },
        events: {
          Expanded: function(width, height) {
            customizer.resize(width, height);
          }
        }
      }
    };

  /**
   * Creates the features defined in property.features
   * Call this after changing properties.features to update the options.
   */
  function createFeatures() {
    properties.features = highed.isArr(properties.features)
      ? properties.features
      : properties.features.split(' ');

    function addOption(option) {
      if (!option || !option.icon) {
        return;
      }

      var o = toolbox.addEntry({
        title: option.title,
        width: option.width,
        icon: option.icon,
        help: option.help
      });

      if (highed.isFn(option.create)) {
        option.create(o.body);
      }

      Object.keys(option.events || {}).forEach(function(e) {
        o.on(e, option.events[e]);
      });
    }

    toolbox.clear();

    properties.features.forEach(function(feature) {
      addOption(builtInOptions[feature] || customOptions[feature] || false);
    });
  }

  /**
   * Create toolbar
   */
  function createToolbar() {
    toolbarButtons.forEach(function(b) {
      if (b === '-') {
        toolbar.addSeparator();
      } else {
        toolbar.addIcon(b);
      }
    });
  }

  /**
   * Resize the chart preview based on a given width
   */
  function resizeChart(newWidth) {
    var psize = highed.dom.size(splitter.bottom);

    highed.dom.style(chartFrame, {
      left: newWidth + 'px',
      width: psize.w - newWidth + 'px',
      height: psize.h + 'px'
    });

    highed.dom.style(chartContainer, {
      width: psize.w - newWidth - 100 + 'px',
      height: psize.h - 100 + 'px'
    });

    chartPreview.resize();

    console.log('resizeChart', newWidth);
  }

  /**
   * Resize everything
   */
  function resize() {
    splitter.resize();
    resizeChart(toolbox.width());
  }

  /**
   * Change the enabled features
   */
  function setEnabledFeatures(feats) {
    properties.features = feats;
    createFeatures();
  }

  /**
   * Add a new feature
   */
  function addFeature(name, feat) {
    customOptions[name] = feat;
    createFeatures();
  }

  //////////////////////////////////////////////////////////////////////////////
  // Event attachments

  toolbox.on('BeforeResize', resizeChart);

  customizer.on('PropertyChange', chartPreview.options.set);
  customizer.on('PropertySetChange', chartPreview.options.setAll);

  templates.on('Select', function(template) {
    chartPreview.loadTemplate(template);
  });

  dataTable.on('Change', function(headers, data) {
    return chartPreview.data.csv({
      csv: dataTable.toCSV(';', true)
    });
  });

  if (!highed.onPhone()) {
    highed.dom.on(window, 'resize', resize);
  }

  //////////////////////////////////////////////////////////////////////////////

  highed.dom.ap(
    toolbar.left,
    highed.dom.style(highed.dom.cr('span'), {
      'margin-left': '2px',
      width: '200px', // 30px
      height: '60px',
      float: 'left',
      display: 'inline-block',
      'background-position': 'left middle',
      'background-size': 'auto 100%',
      'background-repeat': 'no-repeat',
      'background-image':
        'url("data:image/svg+xml;utf8,' +
        encodeURIComponent(highed.resources.logo) +
        '")'
    })
  );

  // Create the features
  createFeatures();
  createToolbar();

  highed.dom.ap(splitter.bottom, highed.dom.ap(chartFrame, chartContainer));

  resize();

  return {
    on: events.on,
    resize: resize,
    /* Get embeddable javascript */
    getEmbeddableHTML: chartPreview.export.html,
    /* Get embeddable json */
    getEmbeddableJSON: chartPreview.export.json,
    /* Get embeddable SVG */
    getEmbeddableSVG: chartPreview.export.svg,

    setEnabledFeatures: setEnabledFeatures,
    addFeature: addFeature,
    chart: chartPreview,
    toolbar: toolbar
  };
};
