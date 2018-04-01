class BookSerializer < ActiveModel::Serializer
  attributes :id, :title, :year_published, :language, :status, :borrower, :user_id, :description

  belongs_to :user
  has_many :comments
  has_many :genres
  has_many :authors
  
end
