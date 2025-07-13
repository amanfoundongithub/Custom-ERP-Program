from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.database    import Database


MONGO_URI = "mongodb://localhost:27017"
DATABASE_NAME = "ERP"

client = AsyncIOMotorClient(MONGO_URI)

db : Database = client[DATABASE_NAME]


# USER'S COLLECTIONS
user_collection = db["user"]

# COMPANY'S COLLECTIONS
company_collection = db["company"] 


# Utility to create DB of the company 
def create_company_db(company_id : str):
    
    # Company DB 
    db_company = client[company_id]
    # Ledger and Journals
    journal = db_company["journal"]
    
    ledger = db_company["ledger"]
    
    # Return these
    return db_company, journal, ledger

