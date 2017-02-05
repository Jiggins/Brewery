class Account < ApplicationRecord
  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_initialize.tap do |account|
      account.provider = auth.provider
      account.uid = auth.uid
      account.name = auth.info.name
      account.oauth_token = auth.credentials.token
      account.oauth_expires_at = Time.at(auth.credentials.expires_at)
      account.save!
    end
  end
end
