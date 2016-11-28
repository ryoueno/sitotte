var TicketBox = React.createClass({
  showModalForm(e) {
    $('#modal_box').modal('show');
  },
  loadTicketsFromServer: function(id) {
    $.ajax({
      url: this.props.url + id,
      dataType: 'json',
      success: function(result) {
        var state = [];
        state['data' + id] = result.data;
        this.setState(state);
      }.bind(this),
      error: function(xhr, status, err) {

      }.bind(this)
    });
  },
  handleTicketSubmit: function(ticket) {
    //親のstate更新
    var state = new Object;
    state['data' + ticket.assign_to] = [ticket].concat(this.state['data' + ticket.assign_to]);
    this.setState(state);
    $.ajax({
      url: this.props.url + 1,
      dataType: 'json',
      type: 'POST',
      data: ticket,
      success: function(data) {
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    var clickMe = document.getElementById("close-btn");
    clickMe.click();
    $('#success-alert').fadeIn(500).delay(2000).fadeOut(500);
  },
  getInitialState: function() {
    // data3 = [data] のように data+idをkeyとしてstateを初期化
    var data = new Object;
    for (var i in this.props.members) {
      data['data' + this.props.members[i].id] = [];
    }
    data['data' + this.props.current_member.id] = [];
    return data;
  },
  render: function() {
    var ticket_list = [];
    ticket_list.push(
      <div key={this.props.current_member.id} className="tab-pane active" id={"user-tab" + this.props.current_member.id}>
        <TicketList loadTickets={this.loadTicketsFromServer} data={this.state['data' + this.props.current_member.id]} member_id={this.props.current_member.id} />
      </div>
    );
    for (var i in this.props.members) {
      ticket_list.push(
        <div key={this.props.members[i].id} className="tab-pane" id={"user-tab" + this.props.members[i].id}>
          <TicketList loadTickets={this.loadTicketsFromServer} data={this.state['data' + this.props.members[i].id]} member_id={this.props.members[i].id} />
        </div>
      );
    }
    return(
      <div>
        <div className="click_btn" onClick={this.showModalForm}>
          作成
        </div>
        <div className="modal fade" id="modal_box">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="box_inner">
                <TicketForm key={this.props.current_member.id} onTicketSubmit={this.handleTicketSubmit} member_id={this.props.current_member.id}/>
                <p className="text-center"><a className="btn btn-primary" data-dismiss="modal" href="#" id="close-btn">閉じる</a></p>
              </div>
            </div>
          </div>
        </div>
        <div className="tab-content">
          {ticket_list}
        </div>
      </div>
    );
  }
});
