Prepare an abstract for a user login system with three types of access:

Owner - the highest level of access, can view all logs, delete them and create new ones.
Admin - can view logs for their own access level and basic level, can create logs, and delete them (for admin and basic levels).
Basic - can only view their own logs and create new ones.
The log object should contain: creation timestamp, creator information, log content, and log type.

The logging system should store all logs, along with information about who created them and when they were saved to the system. Similarly, deleted logs should have information about who deleted them and when.