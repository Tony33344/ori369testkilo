#!/bin/bash
# Booking Workflow Tests for ORI 369

echo "🧪 ORI 369 - Booking Workflow Tests"
echo "======================================"

BASE_URL="http://localhost:3002"

# Test 1: Booking page loads
echo -n "1. /rezervacija page loads... "
if curl -s "$BASE_URL/rezervacija" -o /dev/null -w '%{http_code}' | grep -q "200"; then
  echo "✅ PASS"
else
  echo "❌ FAIL"
fi

# Test 2: Google Calendar API works
echo -n "2. Google Calendar API returns data... "
GCAL_RESPONSE=$(curl -s "$BASE_URL/api/google-calendar/busy?timeMin=2026-01-23T00:00:00.000Z&timeMax=2026-01-23T23:59:59.000Z")
if echo "$GCAL_RESPONSE" | grep -q "busy"; then
  echo "✅ PASS"
else
  echo "❌ FAIL - Response: $GCAL_RESPONSE"
fi

# Test 3: Google Calendar shows blocked slot (11:00 on 23.1)
echo -n "3. Google Calendar shows 11:00 blocked on 23.1... "
if echo "$GCAL_RESPONSE" | grep -q "11:00"; then
  echo "✅ PASS"
else
  echo "❌ FAIL"
fi

# Test 4: Services API returns therapies
echo -n "4. Services include Manualna Terapija... "
SERVICES=$(curl -s "$BASE_URL/terapije" | grep -o "Manualna Terapija" | head -n 1)
if [ "$SERVICES" = "Manualna Terapija" ]; then
  echo "✅ PASS"
else
  echo "❌ FAIL"
fi

# Test 5: Packages page works
echo -n "5. /paketi shows Aktivacija... "
if curl -s "$BASE_URL/paketi" | grep -q "Aktivacija"; then
  echo "✅ PASS"
else
  echo "❌ FAIL"
fi

# Test 6: Login page loads
echo -n "6. /prijava page loads... "
if curl -s "$BASE_URL/prijava" -o /dev/null -w '%{http_code}' | grep -q "200"; then
  echo "✅ PASS"
else
  echo "❌ FAIL"
fi

# Test 7: Registration page loads
echo -n "7. /registracija page loads... "
if curl -s "$BASE_URL/registracija" -o /dev/null -w '%{http_code}' | grep -q "200"; then
  echo "✅ PASS"
else
  echo "❌ FAIL"
fi

# Test 8: Dashboard page loads
echo -n "8. /dashboard page loads... "
if curl -s "$BASE_URL/dashboard" -o /dev/null -w '%{http_code}' | grep -q "200"; then
  echo "✅ PASS"
else
  echo "❌ FAIL"
fi

# Test 9: Checkout page loads
echo -n "9. /checkout page loads... "
if curl -s "$BASE_URL/checkout" -o /dev/null -w '%{http_code}' | grep -q "200"; then
  echo "✅ PASS"
else
  echo "❌ FAIL"
fi

# Test 10: Shop page loads
echo -n "10. /trgovina page loads... "
if curl -s "$BASE_URL/trgovina" -o /dev/null -w '%{http_code}' | grep -q "200"; then
  echo "✅ PASS"
else
  echo "❌ FAIL"
fi

echo "======================================"
echo "Booking workflow tests complete!"
