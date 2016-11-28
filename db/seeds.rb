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
