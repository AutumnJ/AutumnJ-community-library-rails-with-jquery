class BookListWorker 
  require 'csv'
  include Sidekiq::Worker
 
  def perform(list_file)
    CSV.foreach(list_file, headers: true) do |book|
      Book.create(title: book[0], year_published: book[1], language: book[2], description: book[3])
    end
  end
end
