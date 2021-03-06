import Element from '../ast/Element';
import React from 'react';
import PubSub from 'pubsub-js';
import {getVisualizationSettings, setVisualizationSettings} from '../../LocalStorage';
import {logEvent} from '../../utils/logger';

import './css/tree.css'

const ID = 'tree';

export default class Tree extends React.Component {
  constructor(props) {
    super(props);

    this.state = getVisualizationSettings(
      ID,
      {autofocus: true, hideFunctions: true}
    );
  }

  _setOption(name, event) {
    this.setState(
      {[name]: event.target.checked},
      () => setVisualizationSettings(ID, this.state)
    );
    logEvent(
      'tree_view_settings',
      event.target.checked ? 'enabled' : 'disabled',
      name
    );
  }

  render() {
    return (
      <div className="tree-visualization container">
        <div className="toolbar">
          <label title="Auto open the node at the cursor in the source code">
            <input
              type="checkbox"
              checked={this.state.autofocus}
              onChange={this._setOption.bind(this, 'autofocus')}
            />
            Autofocus
          </label>
          <label>
            <input
              type="checkbox"
              checked={this.state.hideFunctions}
              onChange={this._setOption.bind(this, 'hideFunctions')}
            />
            Hide methods
          </label>
          <label>
            <input
              type="checkbox"
              checked={this.state.hideEmptyKeys}
              onChange={this._setOption.bind(this, 'hideEmptyKeys')}
            />
            Hide empty keys
          </label>
          <label>
            <input
              type="checkbox"
              checked={this.state.hideLocationData}
              onChange={this._setOption.bind(this, 'hideLocationData')}
            />
          Hide location data
          </label>
        </div>
        <ul onMouseLeave={() => {PubSub.publish('CLEAR_HIGHLIGHT');}}>
          <Element
            focusPath={this.props.focusPath}
            value={this.props.ast}
            level={0}
            parser={this.props.parser}
            settings={this.state}
          />
        </ul>
      </div>
    );
  }
}

Tree.propTypes = {
  focusPath: React.PropTypes.array,
  ast: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.object,
  ]),
  parser: React.PropTypes.object,
};
