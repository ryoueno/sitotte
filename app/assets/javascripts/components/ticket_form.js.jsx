var TicketForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var title = ReactDOM.findDOMNode(this.refs.title).value.trim();
    var body = ReactDOM.findDOMNode(this.refs.body).value.trim();
    var assign_to = ReactDOM.findDOMNode(this.refs.assign_to).value.trim();
    var state_id = ReactDOM.findDOMNode(this.refs.state_id).value.trim();
    var created_by = ReactDOM.findDOMNode(this.refs.created_by).value.trim();
    if (!title || !body || !assign_to || !state_id || !created_by) {
      return;
    }
    //親のTicketBoxの関数を実行してstateを更新する
    this.props.onTicketSubmit({"title": title, "body": body, "assign_to": assign_to, "state_id": state_id, "created_by": created_by});
    ReactDOM.findDOMNode(this.refs.title).value = '';
    ReactDOM.findDOMNode(this.refs.body).value = '';
    ReactDOM.findDOMNode(this.refs.assign_to).value = '';
    ReactDOM.findDOMNode(this.refs.state_id).value = '';
    return;
  },
  render: function() {
    return (
      <form className="ticketForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="タイトル" required="required" ref="title" />
        <input type="text" placeholder="本文" required="required" ref="body" />
        <input type="number" placeholder="ユーザID" ref="assign_to" />
        <input type="number" placeholder="ステータス" ref="state_id" />
        <input type="hidden" value={this.props.member_id} ref="created_by" />
        <input type="submit" value="Post" className="btn btn-primary" />
      </form>
    );
  }
});
