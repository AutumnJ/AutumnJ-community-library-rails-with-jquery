class CommentSerializer < ActiveModel::Serializer
  attributes :id, :book_id, :user_id, :content

  belongs_to :user
  belongs_to :book
end
