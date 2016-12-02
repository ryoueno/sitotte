var TicketForm = React.createClass({
  getDefaultValues() {
    var defaults = [];
    if (this.props.edit_ticket == null || this.props.edit_ticket.length == 0) return defaults;
    var fields = ['number', 'title', 'assign_to', 'body', 'priority_id', 'state_id', 'deadline'];
    for (var i in fields) {
      defaults[fields[i]] = this.props.edit_ticket[fields[i]] == null ? '' : this.props.edit_ticket[fields[i]];
    }
    defaults['deadline'] = defaults['deadline'] === '' ? 'なし' : defaults['deadline'];
    return defaults;
  },
  //selscted付与用
  selectedOrNone(defaults, key, id) {
    if (defaults[key] == id) return 'selected';
    return '';
  },
  resetForm() {
    if (ReactDOM.findDOMNode(this.refs.title) == null) return;
    ReactDOM.findDOMNode(this.refs.title).value       = '';
    ReactDOM.findDOMNode(this.refs.body).value        = '';
    ReactDOM.findDOMNode(this.refs.assign_to).value   = 1;
    ReactDOM.findDOMNode(this.refs.state_id).value    = 1;
    ReactDOM.findDOMNode(this.refs.priority_id).value = 1;
    ReactDOM.findDOMNode(this.refs.deadline).value    = '';
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var title       = ReactDOM.findDOMNode(this.refs.title).value.trim();
    var body        = ReactDOM.findDOMNode(this.refs.body).value.trim();
    var assign_to   = ReactDOM.findDOMNode(this.refs.assign_to).value.trim();
    var state_id    = ReactDOM.findDOMNode(this.refs.state_id).value.trim();
    var priority_id = ReactDOM.findDOMNode(this.refs.priority_id).value.trim();
    var deadline    = ReactDOM.findDOMNode(this.refs.deadline).value.trim();
    var created_by  = ReactDOM.findDOMNode(this.refs.created_by).value.trim();
    if (!title || !body || !assign_to || !state_id || !priority_id || !created_by) {
      return;
    }
    //親のTicketBoxの関数を実行してstateを更新する
    this.props.onTicketSubmit({
      "title": title,
      "body": body,
      "assign_to": assign_to,
      "state_id": state_id,
      "priority_id": priority_id,
      "deadline": deadline,
      "created_by": created_by,
    });
    this.resetForm();
    return;
  },
  getInitialState: function() {
    var states = new Object;
    states['editing'] = false;
    return states;
  },
  componentDidMount: function() {
    $('.datepicker').datetimepicker({
      format : "YYYY-MM-DD",
    });
  },
  render: function() {
    this.resetForm();
    var defaults = this.getDefaultValues();
    var assignToOptions = [
      <option
        value={this.props.current_member.id}
        selected={this.selectedOrNone(defaults, 'assign_to', this.props.current_member.id)}
      >
        自分
      </option>
    ];
    for (var i in this.props.members) {
      assignToOptions.push(
        <option
          value={this.props.members[i].id}
          selected={this.selectedOrNone(defaults, 'assign_to', this.props.members[i].id)}
        >
          {this.props.members[i].name}
        </option>
      );
    }
    var stateOptions = [];
    for (var i in this.props.states) {
      stateOptions.push(
        <option
          value={this.props.states[i].id}
          selected={this.selectedOrNone(defaults, 'state_id', this.props.states[i].id)}
        >
          {this.props.states[i].name}
        </option>
      );
    }
    var priorityOptions = [];
    for (var i in this.props.priorities) {
      priorityOptions.push(
        <option
          value={this.props.priorities[i].id}
          selected={this.selectedOrNone(defaults, 'priority_id', this.props.priorities[i].id)}
        >
          {this.props.priorities[i].name}
        </option>
      );
    }

    var editview =
      <form className="ticketForm" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <input type="text" value={defaults.title} className="form-control" placeholder="タイトル" required="required" ref="title" />
        </div>
        <div className="form-group">
          <input type="text" value={defaults.body} className="form-control" placeholder="本文" required="required" ref="body" />
        </div>
        <div className="form-group">
          <select ref="assign_to">
            {assignToOptions}
          </select>
        </div>
        <div className="form-group">
          <select ref="state_id">{stateOptions}</select>
        </div>
        <div className="form-group">
          <select ref="priority_id">{priorityOptions}</select>
        </div>
        <div className="form-group">
          <div className="input-group date datepicker">
            <input type="date" value={defaults.deadline} className="form-control" ref="deadline" />
            <span className="input-group-addon">
              <span className="glyphicon glyphicon-calendar"></span>
            </span>
          </div>
        </div>
        <input type="hidden" value={this.props.current_member.id} ref="created_by" />
        <input type="submit" value="Post" className="btn btn-primary" />
      </form>;

    if (Object.keys(defaults).length > 0) {
      var showview =
        <div className="ticketView">
          <h3>#{defaults.number}</h3>
          <ul>
            <li>タイトル：{defaults.title}</li>
            <li>内容：{defaults.body}</li>
            <li>担当者：{this.props.pickPropsById('all_members', defaults.assign_to).name}</li>
            <li>ステータス：{this.props.pickPropsById('states', defaults.state_id).name}</li>
            <li>優先度：{this.props.pickPropsById('priorities', defaults.priority_id).name}</li>
            <li>期日：{defaults.deadline}</li>
          </ul>
        </div>;
    }

    return (
      <div className="ticket-detail">
        <button type="button" value="Push" />
        {(() => {
          if (this.props.editing || Object.keys(defaults).length == 0) {
            return editview;
          } else {
            return showview;
          }
        })()}
      </div>
    );
  }
});
