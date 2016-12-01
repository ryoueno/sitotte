var Ticket = React.createClass({
  render: function() {
    var assign_member = this.props.pickPropsById('all_members', this.props.ticket.assign_to);
    var priority      = this.props.pickPropsById('priorities', this.props.ticket.priority_id);
    var state         = this.props.pickPropsById('states', this.props.ticket.state_id);
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return (
      <div className="ticket">
        <h2 className="ticketTitle" onClick={this.props.showModalForm} data-ticket={this.props.ticket.number}>
          <ul>
            <li>#{this.props.ticket.number}</li>
            <li>{this.props.ticket.title}</li>
            <li>{assign_member.name}</li>
            <li>{priority.name}</li>
            <li>{state.name}</li>
          </ul>
        </h2>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }
});
