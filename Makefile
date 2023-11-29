NAME		= 	inception
GREEN		= 	\033[0;32m
BIG			= 	\033[0;1m
RESET		= 	\033[0m
DATA_PATH	= /home/snaggara/data

all		:
	@docker compose up --build
	@echo "$(GREEN)Création des dockers terminés\nLe site est pret (enfin dans 10 secondes)!\n$(RESET)"
down	:
	@sudo docker compose down
	@echo "$(GREEN)\nLes conteneurs sont down !\n$(RESET)"

cert:
	@echo "Exécution du script Bash..."
	@sudo bash cert.sh
	@sudo update-ca-certificates
fclean	:
	@sudo docker compose down -v
	@echo "$(GREEN)\nLes volumes ont bien été supprimés !$(RESET)"
	@sudo rm -rf $(DATA_PATH)/wordpress;
	@sudo rm -rf $(DATA_PATH)/mariadb;
	@echo "$(GREEN)\nLes dossiers dans $(DATA_PATH) ont bien été supprimés\n$(RESET)"



re		:	down all

.PHONY: all clean fclean re
