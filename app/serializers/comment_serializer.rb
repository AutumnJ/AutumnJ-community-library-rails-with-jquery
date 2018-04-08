class CommentSerializer < ActiveModel::Serializer
  attributes :id, :book_id, :user_id, :content, :updated_at

  belongs_to :user, include: false
  belongs_to :book, include: false
end
