import json
import socket
import os

PORT_RANGE_START = 8000
PORT_RANGE_END = 8999
PORT_FILE = "ports.json"

def load_ports():
    """Load the list of used ports from the JSON file."""
    if not os.path.exists(PORT_FILE):
        return {"used_ports": []}
    with open(PORT_FILE, "r") as f:
        return json.load(f)

def save_ports(data):
    """Save the list of used ports to the JSON file."""
    with open(PORT_FILE, "w") as f:
        json.dump(data, f, indent=2)

def is_port_free(port):
    """Check if a given port is free on localhost."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) != 0

def get_available_port():
    """Find the first available port in a predefined range."""
    ports = load_ports()
    used_ports = ports.get("used_ports", [])

    for port in range(PORT_RANGE_START, PORT_RANGE_END):
        if port not in used_ports and is_port_free(port):
            # Mark the port as used
            used_ports.append(port)
            save_ports({"used_ports": used_ports})
            return port

    raise RuntimeError("No available ports in the defined range.")

