# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

    User.create(:name => 'uenoryo', :email => 'a@a.com', :password => 'aaaaaa')
    User.create(:name => 'uenoryo2', :email => 'a2@a.com', :password => 'aaaaaa')
    User.create(:name => 'uenoryo3', :email => 'a3@a.com', :password => 'aaaaaa')
    User.create(:name => 'uenoryo4', :email => 'a4@a.com', :password => 'aaaaaa')
    User.create(:name => 'uenoryo5', :email => 'a5@a.com', :password => 'aaaaaa')

    Group.create(:name => 'MyGroup', :limit => 5)

    Member.create(:group_id => 1, :user_id => 1, :is_admin => 1, :is_accept => 1)
    Member.create(:group_id => 1, :user_id => 2, :is_admin => 0, :is_accept => 1)
    Member.create(:group_id => 1, :user_id => 3, :is_admin => 0, :is_accept => 1)
    Member.create(:group_id => 1, :user_id => 4, :is_admin => 0, :is_accept => 0)
    Member.create(:group_id => 1, :user_id => 5, :is_admin => 0, :is_accept => 0)

    Ticket.create(:assign_to => 1, :title => 'ticket1', :body => 'This is ticket1.', :state_id => 1, :priority_id => 1, :created_by => 3)
    Ticket.create(:assign_to => 1, :title => 'ticket2', :body => 'This is ticket2.', :state_id => 1, :priority_id => 1, :created_by => 3)
    Ticket.create(:assign_to => 2, :title => 'ticket3', :body => 'This is ticket3.', :state_id => 2, :priority_id => 2, :created_by => 2)
    Ticket.create(:assign_to => 2, :title => 'ticket4', :body => 'This is ticket4.', :state_id => 2, :priority_id => 2, :created_by => 2)
    Ticket.create(:assign_to => 3, :title => 'ticket5', :body => 'This is ticket5.', :state_id => 3, :priority_id => 3, :created_by => 1)
    Ticket.create(:assign_to => 5, :title => 'ticket6', :body => 'This is ticket6.', :state_id => 3, :priority_id => 3, :created_by => 1)

    State.create(:name => '新規')
    State.create(:name => '進行中')
    State.create(:name => '完了')
    State.create(:name => '却下')
    State.create(:name => '保留')

    Priority.create(:name => 'なし')
    Priority.create(:name => '低い')
    Priority.create(:name => '普通')
    Priority.create(:name => '高い')
    Priority.create(:name => '急いで')
