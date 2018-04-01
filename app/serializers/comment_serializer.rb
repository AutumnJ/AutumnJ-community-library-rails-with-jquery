class CommentSerializer < ActiveModel::Serializer
  attributes :id, :book_id, :user_id, :content, :updated_at

  belongs_to :user
  belongs_to :book
end
