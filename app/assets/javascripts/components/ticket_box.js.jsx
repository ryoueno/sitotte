var TicketBox = React.createClass({
  showModalForm(e) {
    var ticket_id = e.currentTarget.getAttribute('data-ticket');
    if (ticket_id != null) {
      this.setState({ edit_ticket: this.pickPropsById('all_tickets', ticket_id)});
    } else {
      this.setState({ edit_ticket: []});
    }
    $('#modal_box').modal('show');
  },
  setSortKey(e) {
    var sortkey = e.currentTarget.getAttribute('data-sortkey');
    var order   = e.currentTarget.getAttribute('data-order');
    if (sortkey != null && sortkey !== this.state.sortkey) {
      this.setState({ sortkey: sortkey});
      this.refreshTicketState();
      this.sortMembersTickets(sortkey, this.state.order);
    }
    if (order != null && order !== this.state.order) {
      this.setState({ order: order});
      this.refreshTicketState();
      this.sortMembersTickets(this.state.sortkey, order);
    }
  },
  //tickets Objectを指定されたkeyで並び替える
  sortTickets(tickets_obj, key, order) {
    key   = key   === undefined ? 'updated_at' : key;
    order = order === undefined ? 'desc'       : order;
    //デフォは降順(DESC)
    var num_a = -1;
    var num_b = 1;

    if (order === 'asc') {//指定があれば昇順(ASC)
      num_a = 1;
      num_b = -1;
    }

    var tickets = [];
    for (var i in tickets_obj) {
      tickets.push(tickets_obj[i]);
    }
    tickets = tickets.sort(function(a, b) {
      var x = a[key];
      var y = b[key];
      if (x > y) return num_a;
      if (x < y) return num_b;
      return 0;
    });

   return tickets; // ソート後の配列を返す
  },
  //Member全員のチケットを指定されたkeyでソートする
  sortMembersTickets(key, order) {
    key   = key   === undefined ? 'updated_at'  : key;
    order = order === undefined ? 'desc' : order;
    for (var i in this.props.all_members) {
      var member_id = this.props.all_members[i].id;
      var state = {};
      if (this.state['tickets' + member_id] != null) {
        state['tickets' + member_id] = this.sortTickets(this.state['tickets' + member_id], key, order);
        this.setState(state);
      }
    }
  },
  //KeyとIDを指定してpropsからデータ取得
  pickPropsById(key, id) {
    for (var i in this.props[key]) {
      if (this.props[key][i].id == id) return this.props[key][i];
    }
  },
  loadTicketsFromServer: function(id) {
    $.ajax({
      url: this.props.get_url + id,
      dataType: 'json',
      success: function(result) {
        var state = [];
        state['tickets' + id] = result.tickets;
        this.setState(state);
      }.bind(this),
      error: function(xhr, status, err) {

      }.bind(this)
    });
  },
  handleTicketSubmit: function(ticket) {
    //親のstate更新
    var state = new Object;
    state['tickets' + ticket.assign_to] = [ticket].concat(this.state['tickets' + ticket.assign_to]);
    this.setState(state);
    $.ajax({
      url: this.props.post_url,
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
  //state.all_ticketsからtickets{member_id}を更新
  //state.all_ticketsに更新があったときに実行し、各メンバーのチケットを全て更新する
  //stateはthis.props.tickets{member_id}.{ticket_id} で取得できるようにする
  refreshTicketState: function() {
    sortkey = this.state.sortkey;
    var state = new Object;
    for (var i in this.state.all_tickets) {
      var member_id = this.state.all_tickets[i].assign_to;
      if (state['tickets' + member_id] == null) state['tickets' + member_id] = {};
      state['tickets' + member_id][this.state.all_tickets[i].id] = this.state.all_tickets[i];
    }
    //強引に初期化　（stateが使い物にならなかったので）
    for (var i in this.props.all_members) {
      state['tickets' + this.props.all_members[i].id] = this.sortTickets(state['tickets' + this.props.all_members[i].id], this.state.sortkey, this.state.order);
    }
    this.setState(state);
  },
  getInitialState: function() {
    // tickets3 = [ticekts] のように tickets+member_idをkeyとしてtickets-stateを初期化
    var states = new Object;
    for (var i in this.props.members) {
      states['tickets' + this.props.members[i].id] = [];
    }
    states['tickets' + this.props.current_member.id] = [];
    states['all_tickets'] = this.props.all_tickets;
    states['edit_ticket'] = [];
    states['sortkey'] = 'updated_at';
    states['order'] = 'desc';

    return states;
  },
  componentDidMount: function() {
    //最初のrender時に更新
    this.refreshTicketState();
  },
  render: function() {
    var ticket_list = [];
    ticket_list.push(
      <div key={this.props.current_member.id} className="tab-pane active" id={"user-tab" + this.props.current_member.id}>
        <TicketList
          loadTickets={this.loadTicketsFromServer}
          showModalForm={this.showModalForm}
          pickPropsById={this.pickPropsById}
          all_members={this.props.all_members}
          tickets={this.state['tickets' + this.props.current_member.id]}
        />
      </div>
    );
    for (var i in this.props.members) {
      ticket_list.push(
        <div key={this.props.members[i].id} className="tab-pane" id={"user-tab" + this.props.members[i].id}>
          <TicketList
            loadTickets={this.loadTicketsFromServer}
            showModalForm={this.showModalForm}
            pickPropsById={this.pickPropsById}
            all_members={this.props.all_members}
            tickets={this.state['tickets' + this.props.members[i].id]}
          />
        </div>
      );
    }
    return(
      <div>
        <div className="click_btn" onClick={this.showModalForm}>
          作成
        </div>
        <div onClick={this.setSortKey} data-sortkey={'id'}>
        ID
        </div>
        <div onClick={this.setSortKey} data-sortkey={'title'}>
        Title
        </div>
        <div onClick={this.setSortKey} data-sortkey={'updated_at'}>
        Updated
        </div>
        <div onClick={this.setSortKey} data-order={'desc'}>
        降順
        </div>
        <div onClick={this.setSortKey} data-order={'asc'}>
        昇順
        </div>

        <div className="modal fade" id="modal_box">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="box_inner">
                <TicketForm
                  key={this.props.current_member.id}
                  edit_ticket={this.state.edit_ticket}
                  onTicketSubmit={this.handleTicketSubmit}
                  current_member={this.props.current_member}
                  members={this.props.members}
                  states={this.props.states}
                  priorities={this.props.priorities}
                />
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
