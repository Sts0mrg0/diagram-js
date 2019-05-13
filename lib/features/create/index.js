import DraggingModule from '../dragging';
import SelectionModule from '../selection';
import RulesModule from '../rules';
import ConnectionPreviewModule from '../connection-preview';

import Create from './Create';
import CreateConnectPreview from './CreateConnectPreview';


export default {
  __depends__: [
    DraggingModule,
    SelectionModule,
    RulesModule,
    ConnectionPreviewModule
  ],
  __init__: [
    'createConnectPreview'
  ],
  create: [ 'type', Create ],
  createConnectPreview: [ 'type', CreateConnectPreview ]
};
