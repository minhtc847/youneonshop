package main

import "time"

//func (app *application) storeActivationToken(key string, userID string, expiration time.Duration) error {
//	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
//	defer cancel()
//
//	err := app.redis.Set(ctx, key, userID, expiration).Err()
//	if err != nil {
//		return fmt.Errorf("failed to store activation token: %w", err)
//	}
//	return nil
//}

type RedisLocal struct {
	ActivateToken map[string]string
	LogoutJWT     map[string]string
}

func (local *RedisLocal) storeActivationToken(key string, userID string, expiration time.Duration) error {
	local.ActivateToken[key] = userID
	return nil
}
func (local *RedisLocal) storeLogoutToken(key string, userID string, expiration time.Duration) error {
	local.LogoutJWT[key] = userID
	return nil
}
func (local *RedisLocal) getActivationToken(key string) string {
	return local.ActivateToken[key]
}
func (local *RedisLocal) isValidActivateToken(key string) bool {
	return local.ActivateToken[key] != ""
}
func (local *RedisLocal) removeActivateToken(token string) error {
	local.ActivateToken[token] = ""
	return nil
}
func (local *RedisLocal) isLogoutToken(token string) bool {
	return local.LogoutJWT[token] != ""
}
func (local *RedisLocal) autoRemoveActivationToken() {

}
func NewRedisLocal() *RedisLocal {
	return &RedisLocal{ActivateToken: make(map[string]string), LogoutJWT: make(map[string]string)}
}
