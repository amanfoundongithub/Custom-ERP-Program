from pydantic import BaseModel
from datetime import datetime

from typing import List


class JournalEntry(BaseModel):
    
    # Journal entries summaries & dates
    dateOfEntry : datetime
    description : str 
    
    # Main entries of the form : 
    # Debit -> List of accounts with dictionaries 
    # Dictionaries like {"name" : , "amount" : } etc. Similar for credit
    # Ensuring the double entry accounting standards are implemented
    debit : List
    credit : List