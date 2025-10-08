DBURL=postgres://postgres:postgres@localhost:5433/authmicroservice

gen-proto:
	protoc -I proto proto/user/*.proto --go_out=proto/gen/ --go_opt=paths=source_relative --go-grpc_out=proto/gen/ --go-grpc_opt=paths=source_relative

mock-services:
	cd ./internal/services && mockery --all

gen-docs:
	swag init -g=internal/controller/rest/v1/router.go -o=docs --parseInternal

migration-up:
	migrate -path migrations -database '${DBURL}?sslmode=disable' up ${version}

migration-down:
	migrate -path migrations -database '${DBURL}?sslmode=disable' down ${version}

migration-force:
	migrate -database "${DBURL}" -path migrations force ${version}
