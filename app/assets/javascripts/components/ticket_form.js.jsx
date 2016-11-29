var TicketForm = React.createClass({
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
    ReactDOM.findDOMNode(this.refs.title).value = '';
    ReactDOM.findDOMNode(this.refs.body).value = '';
    ReactDOM.findDOMNode(this.refs.assign_to).value = 1;
    ReactDOM.findDOMNode(this.refs.state_id).value = 1;
    ReactDOM.findDOMNode(this.refs.priority_id).value = 1;
    ReactDOM.findDOMNode(this.refs.deadline).value = '';
    return;
  },
  componentDidMount: function() {
    $('.datepicker').datetimepicker({
      format : "YYYY-MM-DD",
    });
  },
  render: function() {
    var assignToOptions = this.props.members.map(function (member) {
      return (
        <option value={member.id}>{member.name}</option>
      );
    });
    var stateOptions = this.props.states.map(function (state) {
      return (
        <option value={state.id}>{state.name}</option>
      );
    });
    var priorityOptions = this.props.priorities.map(function (priority) {
      return (
        <option value={priority.id}>{priority.name}</option>
      );
    });
    return (
      <form className="ticketForm" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <input type="text" className="form-control" placeholder="タイトル" required="required" ref="title" />
        </div>
        <div className="form-group">
          <input type="text" className="form-control" placeholder="本文" required="required" ref="body" />
        </div>
        <div className="form-group">
          <select ref="assign_to">
            <option value={this.props.current_member.id}>自分</option>
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
            <input type="date" className="form-control" ref="deadline" />
            <span className="input-group-addon">
              <span className="glyphicon glyphicon-calendar"></span>
            </span>
          </div>
        </div>
        <input type="hidden" value={this.props.current_member.id} ref="created_by" />
        <input type="submit" value="Post" className="btn btn-primary" />
      </form>
    );
  }
});
