#!/bin/bash
# Quick verification tests for ORI 369 website

echo "🧪 ORI 369 - Quick Verification Tests"
echo "======================================"

BASE_URL="http://localhost:3002"

# Test 1: Homepage
echo -n "1. Homepage loads... "
if curl -s "$BASE_URL" | grep -q "ORI 369"; then
  echo "✅ PASS"
else
  echo "❌ FAIL"
fi

# Test 2: Therapies page shows correct therapies
echo -n "2. /terapije shows Manualna Terapija... "
if curl -s "$BASE_URL/terapije" | grep -q "Manualna Terapija"; then
  echo "✅ PASS"
else
  echo "❌ FAIL"
fi

# Test 3: Therapies page shows Platinium
echo -n "3. /terapije shows Platinium... "
if curl -s "$BASE_URL/terapije" | grep -q "Platinium"; then
  echo "✅ PASS"
else
  echo "❌ FAIL"
fi

# Test 4: Therapies page shows Moti Physio
echo -n "4. /terapije shows Moti Physio... "
if curl -s "$BASE_URL/terapije" | grep -q "Moti Physio"; then
  echo "✅ PASS"
else
  echo "❌ FAIL"
fi

# Test 5: Packages page shows Aktivacija
echo -n "5. /paketi shows Aktivacija... "
if curl -s "$BASE_URL/paketi" | grep -q "Aktivacija"; then
  echo "✅ PASS"
else
  echo "❌ FAIL"
fi

# Test 6: Packages page shows Osveščanje
echo -n "6. /paketi shows Osveščanje... "
if curl -s "$BASE_URL/paketi" | grep -q "Osveščanje"; then
  echo "✅ PASS"
else
  echo "❌ FAIL"
fi

# Test 7: Packages page shows Univerzum
echo -n "7. /paketi shows Univerzum... "
if curl -s "$BASE_URL/paketi" | grep -q "Univerzum"; then
  echo "✅ PASS"
else
  echo "❌ FAIL"
fi

# Test 8: Booking page loads
echo -n "8. /rezervacija loads... "
if curl -s "$BASE_URL/rezervacija" -o /dev/null -w '%{http_code}' | grep -q "200"; then
  echo "✅ PASS"
else
  echo "❌ FAIL"
fi

# Test 9: Pricing page loads
echo -n "9. /cenik loads... "
if curl -s "$BASE_URL/cenik" -o /dev/null -w '%{http_code}' | grep -q "200"; then
  echo "✅ PASS"
else
  echo "❌ FAIL"
fi

# Test 10: Login page loads
echo -n "10. /prijava loads... "
if curl -s "$BASE_URL/prijava" -o /dev/null -w '%{http_code}' | grep -q "200"; then
  echo "✅ PASS"
else
  echo "❌ FAIL"
fi

echo "======================================"
echo "Tests complete!"
