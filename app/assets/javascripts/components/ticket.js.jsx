var Ticket = React.createClass({
  render: function() {
    var assign_member = this.props.pickPropsById('all_members', this.props.ticket.assign_to);
    var priority      = this.props.pickPropsById('priorities', this.props.ticket.priority_id);
    var state         = this.props.pickPropsById('states', this.props.ticket.state_id);
    var stars = [];
    // priority.id = 優先度レベルとする。
    var MAX_STAR = 5;
    for (var i = 1; i <= MAX_STAR; i++) {
      var class_name = i <=priority.id ? "star-on" : "star-off";
      var star       = i <=priority.id ? "★"       : "☆";
      stars.push(
        <span className={"star " + class_name}>{star}</span>
      );
    }
    //var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return (
      <div className="ticket" onClick={this.props.showModalForm} data-ticket={this.props.ticket.number}>
        <h3 className="ticket-number">No.{("0" + this.props.ticket.number).slice(-2)}</h3>
        <h2 className="ticket-title">{this.props.ticket.title}</h2>
        <span className={"state-name state"+ state.id}>{state.name}</span>
        <span className="priority">
          <span className="priority-label">優先度：</span>{stars}
        </span>
      </div>
    );
  }
});
